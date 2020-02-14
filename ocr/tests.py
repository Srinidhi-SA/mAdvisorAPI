"""
OCR AUTOMATED TESTCASES
"""
import simplejson as json
#
from django.contrib.auth.models import User, AnonymousUser
# from django.urls import reverse
from rest_framework import status
# from rest_framework.authtoken.models import Token
# from rest_framework.test import APITestCase
from rest_framework.test import APIClient

from django.test import TestCase, RequestFactory
import tempfile
from ocr.serializers import OCRImageSerializer, OCRImageListSerializer
from ocr.models import OCRImage

from PIL import Image


class TestOCRImageUpload(TestCase):

    def setUp(self):
        # Every test needs access to the request factory.
        """
        Setup User and Authentication
        UserType: Superuser
        """

        self.credentials = {
            'username': 'dladmin',
            'password': 'thinkbig',
            'email': 'test@mail.com'}
        test_user = User.objects.create_superuser(**self.credentials)

        self.client = APIClient()
        response = self.client.post('http://localhost:8000/api-token-auth/',
                                    {'username': 'dladmin', "password": "thinkbig"}, format='json')
        self.token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

    def test_OCRImage_create(self):
        """
        METHOD: [CREATE]
            TestCase1: "Test single image upload."
            TestCase2: "Test multiple image upload."
            TestCase3: "Test valid/Invalid file extensions."
        METHOD: [GET]
            TestCase1: "List of image uploaded."
        METHOD: [RETRIEVE]
            TestCase1: "Retrieve image uploaded with particular slug."
        METHOD: [PUT/UPDATE]
            TestCase1: "Update image uploaded with particular slug."
        METHOD: [DELETE]
            TestCase1: "Delete image uploaded with particular slug."
        """

        image = Image.new('RGB', (100, 100))

        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file, format='jpeg')
        tmp_file.seek(0)
        response = self.client.post('http://localhost:8000/ocr/ocrimage/', {'imagefile': tmp_file}, format='multipart')

        # self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.json()['imageset_message'], response.json()['message'])

    def test_OCRImage_create_multiple(self):
        """
        TestCase1: "Test single image upload."
        TestCase2: "Test multiple image upload."
        TestCase3: "Test valid/Invalid file extensions."
        """

        img_list = list()
        for i in range(3):
            image = Image.new('RGB', (100, 100), color='red')
            tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
            image.save(tmp_file, format=image.format)
            tmp_file.seek(0)
            img_list.append(tmp_file)

        response = self.client.post('http://localhost:8000/ocr/ocrimage/', {'imagefile': img_list}, format='multipart')

        # self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.json()['imageset_message'], response.json()['message'])

    def test_OCRImage_extension_validation(self):
        """
        TestCase1: "Test single image upload."
        TestCase2: "Test multiple image upload."
        TestCase3: "Test valid/Invalid file extensions."
        """

        tmp_file = tempfile.NamedTemporaryFile(suffix='.txt')
        tmp_file.write(b'test')
        tmp_file.seek(0)
        response = self.client.post('http://localhost:8000/ocr/ocrimage/', {'imagefile': tmp_file}, format='multipart')
        res = response.json()
        self.assertEqual('Unsupported file extension.' in res['serializer_error'], True)

    def test_OCRImage_list(self):

        img_list = list()
        for i in range(3):
            image = Image.new('RGB', (100, 100), color='red')
            tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
            image.save(tmp_file, format=image.format)
            tmp_file.seek(0)
            img_list.append(tmp_file)

        self.client.post('http://localhost:8000/ocr/ocrimage/', {'imagefile': img_list}, format='multipart')
        response = self.client.get('http://localhost:8000/ocr/ocrimage/', format='json')

        self.assertEqual(response.json()['current_item_count'], 3)
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    def test_OCRImage_update(self):

        image = Image.new('RGB', (100, 100))

        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file, format='jpeg')
        tmp_file.seek(0)
        self.client.post('http://localhost:8000/ocr/ocrimage/', {'imagefile': tmp_file}, format='multipart')
        imagequery = OCRImage.objects.all().first()
        slug = imagequery.slug
        response = self.client.put('http://localhost:8000/ocr/ocrimage/{}/'.format(slug), {'name': 'unit-test'})

        self.assertEqual(response.json()['name'], 'unit-test')

    def test_OCRImage_retrieve(self):

        image = Image.new('RGB', (100, 100))

        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file, format='jpeg')
        tmp_file.seek(0)
        response = self.client.post('http://localhost:8000/ocr/ocrimage/', {'imagefile': tmp_file}, format='multipart')

        data = response.json()['serializer_data'][0]
        slug = data['slug']
        response = self.client.get('http://localhost:8000/ocr/ocrimage/{}/'.format(slug))

        self.assertEqual(status.HTTP_200_OK, response.status_code)


'''
class RegistrationTestCase(APITestCase):

    def test_registration(self):
        data = {"username": "testcase", "email": "test@localhost.app",
                "password1": "some_strong_psw", "password2": "some_strong_psw"}
        response = self.client.post("/api/rest-auth/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class OCRImageViewSetTestCase(APITestCase):

    list_url = reverse("ocrimage")

    def setUp(self):
        self.user = User.objects.create_user(username="davinci",
                                             password="some-very-strong-psw")
        self.token = Token.objects.create(user=self.user)
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_profile_list_authenticated(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_profile_list_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_profile_detail_retrieve(self):
        response = self.client.get(reverse("profile-detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"], "davinci")

    def test_profile_update_by_owner(self):
        response = self.client.put(reverse("profile-detail", kwargs={"pk": 1}),
                                   {"city": "Anchiano", "bio": "Renaissance Genius"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content),
                         {"id": 1, "user": "davinci", "bio": "Renaissance Genius",
                          "city": "Anchiano", "avatar": None})

    def test_profile_update_by_random_user(self):
        random_user = User.objects.create_user(username="random",
                                               password="psw123123123")
        self.client.force_authenticate(user=random_user)
        response = self.client.put(reverse("profile-detail", kwargs={"pk": 1}),
                                   {"bio": "hacked!!!"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ProfileStatusViewSetTestCase(APITestCase):

    url = reverse("status-list")

    def setUp(self):
        self.user = User.objects.create_user(username="davinci",
                                             password="some-very-strong-psw")
        self.status = ProfileStatus.objects.create(user_profile=self.user.profile,
                                                   status_content="status test")
        self.token = Token.objects.create(user=self.user)
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_status_list_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_status_list_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_status_create(self):
        data = {"status_content": "a new status!"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user_profile"], "davinci")
        self.assertEqual(response.data["status_content"], "a new status!")

    def test_single_status_retrieve(self):
        serializer_data = ProfileStatusSerializer(instance=self.status).data
        response = self.client.get(reverse("status-detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(serializer_data, response_data)

    def test_status_update_owner(self):
        data = {"status_content": "content updated"}
        response = self.client.put(reverse("status-detail", kwargs={"pk": 1}),
                                   data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status_content"], "content updated")

    def test_status_update_random_user(self):
        random_user = User.objects.create_user(username="random",
                                               password="psw123123123")
        self.client.force_authenticate(user=random_user)
        data = {"status_content": "You Have Been Hacked!"}
        response = self.client.put(reverse("status-detail", kwargs={"pk": 1}),
                                   data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
'''


class TestOCRImageSetView(TestCase):

    pass
