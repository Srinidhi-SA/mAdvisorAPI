"""
View Implementations for OCRImage and OCRImageset models.
"""

import copy
import os
import random
import ast
import simplejson as json
from django.conf import settings
from django.core.files import File
from django.http import JsonResponse
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from rest_framework.decorators import list_route
from api.datasets.helper import convert_to_string
from api.utils import name_check
# ---------------------EXCEPTIONS-----------------------------
from api.exceptions import creation_failed_exception, \
    retrieve_failed_exception
# ------------------------------------------------------------
from ocr.query_filtering import get_listed_data, get_image_list_data
from ocr.tasks import extract_from_image
# -----------------------MODELS-------------------------------
from .models import OCRImage, OCRImageset, OCRUserProfile, ReviewerType, Project

# ------------------------------------------------------------
# ---------------------PERMISSIONS----------------------------
from .permission import OCRImageRelatedPermission
# ------------------------------------------------------------

from ocr.tasks import extract_from_image, get_word, update_words, word_not_clear, final_data_generation
from celery.result import AsyncResult

# ---------------------SERIALIZERS----------------------------
from .serializers import OCRImageSerializer, \
    OCRImageListSerializer, \
    OCRImageSetSerializer, \
    OCRImageSetListSerializer, \
    OCRUserProfileListSerializer, \
    OCRUserProfileSerializer, \
    OCRUserSerializer, \
    OCRUserListSerializer, \
    ReviewerTypeSerializer, \
    ProjectSerializer, \
    ProjectListSerializer, \
    OCRImageExtractListSerializer

# ------------------------------------------------------------

# ---------------------PAGINATION----------------------------
from .pagination import CustomOCRPagination

# ---------------------S3 Files-----------------------------
from .dataloader import S3File
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.list import ListView
#from django.contrib.admin.views.decorators import staff_member_required
from .forms import CustomUserCreationForm, CustomUserEditForm

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import generics
from django.db.models import Q
# Create your views here.
# -------------------------------------------------------------------------------
# pylint: disable=too-many-ancestors
# pylint: disable=no-member
# pylint: disable=too-many-return-statements
# pylint: disable=too-many-locals
# pylint: disable=too-many-branches
# pylint: disable=unused-argument
# pylint: disable=line-too-long
# pylint: disable=too-many-statements
# -------------------------------------------------------------------------------

def ocr_datasource_config_list(request):
    """
    METHOD: OCR DATASOURCES CONFIG LIST BASED ON USER PERMISSIONS
    ALLOWED REQUESTS : [GET]
    PARAMETERS: None
    """
    user = request.user
    data_source_config = copy.deepcopy(settings.OCR_DATA_SOURCES_CONFIG)
    upload_permission_map = {
        'api.upload_from_file': 'fileUpload',
        'api.upload_from_sftp': 'SFTP',
        'api.upload_from_s3': 'S3'
    }

    upload_permitted_list = []

    for key in upload_permission_map:
        if user.has_perm(key):
            upload_permitted_list.append(upload_permission_map[key])

    permitted_source_config = {
        "conf": []
    }

    # print(list(data_source_config.keys()))
    for data in data_source_config['conf']:
        if data['dataSourceType'] in upload_permitted_list:
            permitted_source_config['conf'].append(data)

    return JsonResponse(data_source_config)


# -------------------------------------------------------------------------------

#-------------------------------------------------------------------------------
class OCRUserView(viewsets.ModelViewSet):
    """
    Model: USER
    Viewset : OCRUserView
    Description :
    """
    serializer_class = OCRUserListSerializer
    model = User
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomOCRPagination

    def get_queryset(self):
        queryset = User.objects.filter(
            ~Q(is_active=False),
        ).exclude(id='1').order_by('-date_joined') #Excluding "ANONYMOUS_USER_ID"
        return queryset

    def create(self, request, *args, **kwargs):

        if not request.user.is_staff and not request.user.is_superuser:
            return JsonResponse({
                "created": False,
                "message": "Not Allowed to add User."
            })
        if request.method == 'POST':
            form = CustomUserCreationForm(request.POST)
            if form.is_valid():
                form.save()
                return JsonResponse({
                    "created": True,
                    "message": "User added successfully."
                })
            else:
                return JsonResponse({
                    "created": False,
                    "message": form.errors
                })
        else:
            return JsonResponse({
                "created": False,
                "message": "Invalid Method."
            })

    def list(self, request, *args, **kwargs):

        return get_listed_data(
            viewset=self,
            request=request,
            list_serializer=OCRUserListSerializer
        )

    @list_route(methods=['post'])
    def edit(self, request, *args, **kwargs):

        username = request.POST.get('username')

        user = User.objects.get(username=username)

        if request.method == 'POST':
            form = CustomUserEditForm(request.POST, instance=user)
            if form.is_valid():
                form.save()
                return JsonResponse({
                    "updated": True,
                    "message": "User profile Updated successfully."
                })
            else:
                return JsonResponse({
                    "updated": False,
                    "message": form.errors
                })
        else:
            return JsonResponse({
                "updated": False,
                "message": "Invalid Method."
            })

    def delete(self, request, *args, **kwargs):
        """Delete OCR User"""
        username = request.data['username']
        try:
            user_object = User.objects.get(username = username)
            user_object.delete()
            return JsonResponse({
                "deleted": True,
                "message": "User deleted."
            })

        except User.DoesNotExist:
            return JsonResponse({
                "deleted": False,
                "message": "User DoesNotExist."
            })
        except Exception as e:
            return JsonResponse({
                "deleted": False,
                "message":str(e)
            })


#-------------------------------------------------------------------------------

#-------------------------------------------------------------------------------
class OCRUserProfileView(viewsets.ModelViewSet):
    """
    Model: OCRUserProfile
    Viewset : OCRUserProfileView
    Description :
    """
    serializer_class = OCRUserProfileSerializer
    model = OCRUserProfile
    permission_classes = (IsAuthenticated,)
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = OCRUserProfile.objects.filter(
            ~Q(is_active=False)
        ).order_by('-created_at')
        return queryset

    def get_object_from_all(self):
        """
        Returns the queryset of OCRUserProfile filtered by the slug.
        """
        return OCRUserProfile.objects.get(
            slug=self.kwargs.get('slug')
        )

    def retrieve(self, request, *args, **kwargs):
        """Returns specific object details"""
        instance = self.get_object_from_all()

        if instance is None:
            return retrieve_failed_exception("Profile Doesn't exist.")

        serializer = OCRUserProfileSerializer(instance=instance, context={'request': request})
        profile_details = serializer.data

        return Response(profile_details)

#-------------------------------------------------------------------------------

#-------------------------------------------------------------------------------

class ReviewerTypeListView(generics.ListCreateAPIView):

    queryset = ReviewerType.objects.filter(deleted=False)
    serializer_class = ReviewerTypeSerializer
    permission_classes = [IsAdminUser]

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = ReviewerTypeSerializer(queryset, many=True)
        return Response(serializer.data)

#-------------------------------------------------------------------------------

# -------------------------------------------------------------------------------

class OCRImageView(viewsets.ModelViewSet, viewsets.GenericViewSet):
    """
    Model: OCRImage
    Viewset : OCRImageView
    Description :
    """
    serializer_class = OCRImageSerializer
    lookup_field = 'slug'
    filter_backends = (DjangoFilterBackend,)
    pagination_class = CustomOCRPagination
    permission_classes = (OCRImageRelatedPermission,)

    def get_queryset(self):
        queryset = OCRImage.objects.filter(
            created_by=self.request.user,
            deleted=False,
            status__in=['Ready to recognize.', 'Ready to verify.', 'Ready to export.']
        ).order_by('-created_at').select_related('imageset')
        return queryset

    def get_object_from_all(self):
        """
        Returns the queryset of OCRImage filtered by the slug.
        """
        return OCRImage.objects.get(
            slug=self.kwargs.get('slug'),
            created_by=self.request.user
        )

    @list_route(methods=['post'])
    def get_s3_files(self, request, **kwargs):
        """
        Returns the lists of files from the s3 bucket.
        """
        if 'data' in kwargs:
            data = kwargs.get('data')
        else:
            data = request.data
        data = convert_to_string(data)
        s3_file_lists = S3File()
        files_list = s3_file_lists.s3_files(**data)
        response = files_list
        return JsonResponse(response)

    # queryset = OCRImage.objects.all()

    def create(self, request, *args, **kwargs):

        imageset_id = None
        serializer_data, serializer_error, imagepath, response = list(), list(), list(), dict()
        if 'data' in kwargs:
            data = kwargs.get('data')
        else:
            data = request.data
        data = convert_to_string(data)
        img_data = data

        if data['dataSourceType'] == 'fileUpload':
            if 'imagefile' in data:
                files = request.FILES.getlist('imagefile')
                for file in files:
                    imagepath.append(file.name[:-4].replace('.', '_'))

        if data['dataSourceType'] == 'S3':
            s3_downloader = S3File()
            files_download = s3_downloader.download_file_from_s3(**data)
            if files_download['status'] == 'SUCCESS':
                s3_dir = files_download['file_path']
                files = [f for f in os.listdir(s3_dir) if os.path.isfile(os.path.join(s3_dir, f))]
                for file in files:
                    imagepath.append(file)

        if data['dataSourceType'] == 'SFTP':
            pass

        imageset_data = dict()
        imageset_data['imagepath'] = str(imagepath)
        imageset_data['created_by'] = request.user.id
        serializer = OCRImageSetSerializer(data=imageset_data, context={"request": self.request})

        if serializer.is_valid():
            imageset_object = serializer.save()
            imageset_object.create()
            imageset_id = imageset_object.id
            response['imageset_serializer_data'] = serializer.data
            response['imageset_message'] = 'SUCCESS'
        else:
            response['imageset_serializer_error'] = serializer.errors
            response['imageset_message'] = 'FAILED'

        for file in files:
            if data['dataSourceType'] == 'S3':
                img_data = dict()
                django_file = File(open(os.path.join(s3_dir, file), 'rb'), name=file)
                img_data['imagefile'] = django_file
                img_data['imageset'] = OCRImageset.objects.filter(id=imageset_id)
                if file is None:
                    img_data['name'] = img_data.get('name',
                                                    img_data.get('datasource_type', "H") + "_" + str(
                                                        random.randint(1000000, 10000000)))
                else:
                    img_data['name'] = file[:-4].replace('.', '_')

            if data['dataSourceType'] == 'fileUpload':
                img_data['imagefile'] = file
                img_data['imageset'] = OCRImageset.objects.filter(id=imageset_id)
                if file is None:
                    img_data['name'] = img_data.get('name',
                                                    img_data.get('datasource_type', "H") + "_" + str(
                                                        random.randint(1000000, 10000000)))
                else:
                    img_data['name'] = file.name[:-4].replace('.', '_')

            if data['dataSourceType'] == 'SFTP':
                pass

            imagename_list = []
            image_query = self.get_queryset()
            for i in image_query:
                imagename_list.append(i.imagefile.name)
            if img_data['name'] in imagename_list:
                serializer_error.append(creation_failed_exception("Image name already exists!."))

            img_data['project'] = Project.objects.filter(slug=img_data['projectslug'])
            img_data['created_by'] = request.user.id
            serializer = OCRImageSerializer(data=img_data, context={"request": self.request})
            if serializer.is_valid():
                image_object = serializer.save()
                image_object.create()
                serializer_data.append(serializer.data)
            else:
                serializer_error.append(serializer.errors)
        if not serializer_error:
            response['serializer_data'] = serializer_data
            response['message'] = 'SUCCESS'
        else:
            response['serializer_error'] = str(serializer_error)
            response['message'] = 'FAILED'
        return JsonResponse(response)

    def list(self, request, *args, **kwargs):

        return get_listed_data(
            viewset=self,
            request=request,
            list_serializer=OCRImageListSerializer
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object_from_all()

        if instance is None:
            return retrieve_failed_exception("File Doesn't exist.")

        serializer = OCRImageSerializer(instance=instance, context={'request': request})
        object_details = serializer.data

        return Response(object_details)

    def update(self, request, *args, **kwargs):
        data = request.data
        data = convert_to_string(data)

        if 'name' in data:
            imagename_list = []
            image_query = OCRImage.objects.filter(deleted=False, created_by=request.user)
            for _, i in enumerate(image_query):
                imagename_list.append(i.name)
            if data['name'] in imagename_list:
                return creation_failed_exception("Name already exists!.")
            should_proceed = name_check(data['name'])
            if should_proceed < 0:
                if should_proceed == -1:
                    return creation_failed_exception("Name is empty.")
                if should_proceed == -2:
                    return creation_failed_exception("Name is very large.")
                if should_proceed == -3:
                    return creation_failed_exception("Name have special_characters.")

        try:
            instance = self.get_object_from_all()
            if 'deleted' in data:
                if data['deleted']:
                    print('let us deleted')
                    instance.delete()
                    # clean_up_on_delete.delay(instance.slug, OCRImage.__name__)
                    return JsonResponse({'message': 'Deleted'})
        except FileNotFoundError:
            return creation_failed_exception("File Doesn't exist.")

        serializer = self.get_serializer(instance=instance, data=data, partial=True, context={"request": self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    @list_route(methods=['get'])
    def extract(self, request, *args, **kwargs):
        data = request.data
        response = list()

        if 'imageslug' in data:
            for slug in ast.literal_eval(str(data['imageslug'])):
                image_queryset = OCRImage.objects.get(slug=slug)
                response = extract_from_image.delay(image_queryset.imagefile.path, slug)
                result = response.task_id
                res = AsyncResult(result)
                while True:
                    if res.status == 'SUCCESS':
                        response = res.result
                        break
                OCRImage.objects.filter(slug=slug).update(converted_Coordinates=json.dumps(response['data2']))
                OCRImage.objects.filter(slug=slug).update(comparision_data=json.dumps(response['data3']))
                OCRImage.objects.filter(slug=slug).update(flag=json.dumps(response['flag']))
                OCRImage.objects.filter(slug=slug).update(analysis=json.dumps(response['analysis']))
                OCRImage.objects.filter(slug=slug).update(status='Ready to verify.')
                OCRImage.objects.filter(slug=slug).update(generated_image=File(name='{}_generated_image.png'.format(slug), file=open(response['extracted_image'])))
                response.update({'message': 'SUCCESS'})

        response = {'extraction_info': response}
        return JsonResponse(response)

    @list_route(methods=['get'])
    def get_images(self, request, *args, **kwargs):

        return get_listed_data(
            viewset=self,
            request=request,
            list_serializer=OCRImageExtractListSerializer
        )

    @list_route(methods=['get'])
    def get_word(self, request, *args, **kwargs):
        data = request.data
        x = data['x']
        y = data['y']

        image_queryset = OCRImage.objects.get(slug=data['imageslug'])
        converted_Coordinates = json.loads(image_queryset.converted_Coordinates)

        response = get_word.delay(converted_Coordinates, x, y)
        result = response.task_id
        res = AsyncResult(result)
        while True:
            if res.status == 'SUCCESS':
                response, index = res.result
                break
        return JsonResponse({'word': response, 'index': index})

    @list_route(methods=['get'])
    def update_word(self, request, *args, **kwargs):
        data = request.data
        index = data['index']
        word = data['word']

        image_queryset = OCRImage.objects.get(slug=data['imageslug'])
        comparision_data = json.loads(image_queryset.comparision_data)

        response = update_words.delay(index, word, comparision_data)

        result = response.task_id
        res = AsyncResult(result)
        while True:
            if res.status == 'SUCCESS':
                response, analysis_list = res.result
                break
        OCRImage.objects.filter(slug=data['imageslug']).update(comparision_data=json.dumps(response))
        if 'analysis_list' in request.session:
            request.session['analysis_list'].append(analysis_list)
        else:
            request.session['analysis_list'] = analysis_list
        OCRImage.objects.filter(slug=data['imageslug']).update(analysis_list=json.dumps(request.session['analysis_list']))
        return JsonResponse({'message': 'done'})

    @list_route(methods=['get'])
    def not_clear(self, request, *args, **kwargs):
        data = request.data
        index = data['index']
        word = data['word']

        image_queryset = OCRImage.objects.get(slug=data['imageslug'])
        comparision_data = json.loads(image_queryset.comparision_data)

        response = word_not_clear.delay(index, word, comparision_data)

        result = response.task_id
        res = AsyncResult(result)
        while True:
            if res.status == 'SUCCESS':
                response, analysis_list = res.result
                break
        OCRImage.objects.filter(slug=data['imageslug']).update(comparision_data=json.dumps(response))
        if 'analysis_list' in request.session:
            request.session['analysis_list'].append(analysis_list)
        else:
            request.session['analysis_list'] = analysis_list
        OCRImage.objects.filter(slug=data['imageslug']).update(
            analysis_list=json.dumps(request.session['analysis_list']))

        return JsonResponse({'message': 'done'})

    @list_route(methods=['get'])
    def final_analysis(self, request, *args, **kwargs):
        data = request.data

        image_queryset = OCRImage.objects.get(slug=data['imageslug'])
        analysis = json.loads(image_queryset.analysis)

        response = final_data_generation.delay(image_queryset.imagefile.path, analysis,
                                               json.loads(image_queryset.analysis_list),
                                               image_queryset.flag)

        result = response.task_id
        res = AsyncResult(result)
        while True:
            if res.status == 'SUCCESS':
                flag, json_final, metadata, analysis = res.result
                break
        OCRImage.objects.filter(slug=data['imageslug']).update(analysis=json.dumps(analysis))
        if flag == 'Transcript':
            OCRImage.objects.filter(slug=data['imageslug']).update(final_result=str(json_final))
        else:
            OCRImage.objects.filter(slug=data['imageslug']).update(final_result=json.dumps(json_final))

        return JsonResponse({'message': 'done'})


class OCRImagesetView(viewsets.ModelViewSet, viewsets.GenericViewSet):
    """
    Model: OCRImage
    Viewset : OCRImageView
    Description :
    """
    serializer_class = OCRImageSetSerializer
    lookup_field = 'slug'
    filter_backends = (DjangoFilterBackend,)
    pagination_class = CustomOCRPagination
    permission_classes = (OCRImageRelatedPermission,)

    def get_queryset(self):
        """
        Returns an ordered queryset object of OCRImageset filtered for a particular user.
        """
        queryset = OCRImageset.objects.filter(
            created_by=self.request.user,
            deleted=False,
            status__in=['Not Registered']
        ).order_by('-created_at')
        return queryset

    def get_object_from_all(self):
        """
        Returns the queryset of OCRImageset filtered by the slug.
        """
        return OCRImageset.objects.get(
            slug=self.kwargs.get('slug'),
            created_by=self.request.user,
            deleted=False
        )

    # pylint: disable=unused-argument
    def retrieve(self, request, *args, **kwargs):
        ocrimageset_object = self.get_object_from_all()
        imageset_list = ocrimageset_object.imagepath
        imageset_list = ast.literal_eval(imageset_list)
        image_queryset = OCRImage.objects.filter(
            name__in=imageset_list,
            imageset=ocrimageset_object.id,
            deleted=False)
        return get_image_list_data(
            viewset=OCRImageView,
            queryset=image_queryset,
            request=request,
            serializer=OCRImageListSerializer
        )

    def list(self, request, *args, **kwargs):
        return get_listed_data(
            viewset=self,
            request=request,
            list_serializer=OCRImageSetListSerializer
        )


class ProjectView(viewsets.ModelViewSet, viewsets.GenericViewSet):
    """
    Model: Project
    Viewset : ProjectView
    Description :
    """
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    filter_backends = (DjangoFilterBackend,)
    pagination_class = CustomOCRPagination
    permission_classes = (OCRImageRelatedPermission,)

    def get_queryset(self):
        """
        Returns an ordered queryset object of OCRImageset filtered for a particular user.
        """
        queryset = Project.objects.filter(
            created_by=self.request.user,
            deleted=False,
        ).order_by('-created_at')
        return queryset

    def get_object_from_all(self):
        """
        Returns the queryset of OCRImageset filtered by the slug.
        """
        return Project.objects.get(
            slug=self.kwargs.get('slug'),
            created_by=self.request.user,
            deleted=False
        )

    # pylint: disable=unused-argument
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object_from_all()

        if instance is None:
            return retrieve_failed_exception("File Doesn't exist.")

        serializer = ProjectSerializer(instance=instance, context={'request': request})
        object_details = serializer.data

        return Response(object_details)

    def list(self, request, *args, **kwargs):
        return get_listed_data(
            viewset=self,
            request=request,
            list_serializer=ProjectListSerializer
        )

    def create(self, request, *args, **kwargs):

        response = dict()

        if 'data' in kwargs:
            data = kwargs.get('data')
        else:
            data = request.data
        data = convert_to_string(data)
        projectname_list = []
        project_query = self.get_queryset()
        for i in project_query:
            projectname_list.append(i.name)
        if data['name'] in projectname_list:
            response['project_serializer_error'] = creation_failed_exception("project name already exists!.")

        data['created_by'] = request.user.id

        serializer = ProjectSerializer(data=data, context={"request": self.request})

        if serializer.is_valid():
            project_object = serializer.save()
            project_object.create()
            response['project_serializer_data'] = serializer.data
            response['project_serializer_message'] = 'SUCCESS'
        else:
            response['project_serializer_error'] = serializer.errors
            response['project_serializer_message'] = 'FAILED'

        return JsonResponse(response)
