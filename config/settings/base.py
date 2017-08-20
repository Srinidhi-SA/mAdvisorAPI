"""
Django settings for madvisor_api project.

Generated by 'django-admin startproject' using Django 1.11.4.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os
import datetime

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '&j=7xx+szuncx4&!94sjx5p49yjc^drcptwmw#64#z39t(@^65'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["192.168.33.128"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
    'django_filters'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


REST_FRAMEWORK = {
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.CursorPagination',
    'PAGE_SIZE': 10000,
    'EXCEPTION_HANDLER': 'api.exceptions.custom_exception_handler'
}


JWT_AUTH = {
    'JWT_ENCODE_HANDLER':
    'rest_framework_jwt.utils.jwt_encode_handler',

    'JWT_DECODE_HANDLER':
    'rest_framework_jwt.utils.jwt_decode_handler',

    'JWT_PAYLOAD_HANDLER':
    'rest_framework_jwt.utils.jwt_payload_handler',

    'JWT_PAYLOAD_GET_USER_ID_HANDLER':
    'rest_framework_jwt.utils.jwt_get_user_id_from_payload_handler',

    'JWT_RESPONSE_PAYLOAD_HANDLER':
    # 'rest_framework_jwt.utils.jwt_response_payload_handler',
    'api.user_helper.jwt_response_payload_handler',

    'JWT_SECRET_KEY': SECRET_KEY,
    'JWT_GET_USER_SECRET_KEY': None,
    'JWT_PUBLIC_KEY': None,
    'JWT_PRIVATE_KEY': None,
    'JWT_ALGORITHM': 'HS256',
    'JWT_VERIFY': True,
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_LEEWAY': 0,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=30000),
    'JWT_AUDIENCE': None,
    'JWT_ISSUER': None,

    'JWT_ALLOW_REFRESH': False,
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),

    'JWT_AUTH_HEADER_PREFIX': 'JWT',
    'JWT_AUTH_COOKIE': None,

}


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(os.path.dirname(BASE_DIR), "static"),
    '/home/marlabs/codebase/mAdvisor-api/static'
]

MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = '/media/'

UPLOAD_FOLDER = '/uploads/datasets/'

DATA_SOURCES_CONFIG = {"conf":  [{
        "dataSourceType": "fileUpload",
        "dataSourceName" : "File Upload",
  		"formFields": [{
			"fieldType": "file",
			"name": "File"
		}]
},
	{
		"dataSourceType": "MySQL",
        "dataSourceName" : "MySQL",
		"formFields": [{
                    "fieldType": "Input",
                				"placeHolder": "host",
                				"labelName": "Host"
                },
			{
				"fieldType": "Input",
				"placeHoplaceHolder": "port",
				"labelName": "Port",
				"defaultValue": 3306
                },
			{
				"fieldType": "Input",
				"placeHolder": "schema",
				"labelName": "Schema"
                },
			{
				"fieldType": "Input",
				"placeHolder": "username",
				"labelName": "Username"
                },
			{
				"fieldType": "Password",
				"placeHolder": "password",
				"labelName": "Password"
                },
			{
				"fieldType": "Input",
				"placeHolder": "tablename",
				"labelName": "Table Name"
                }
		]
}


]
}
# dev api http://34.196.204.54:9092
THIS_SERVER_DETAILS = {
    "host": "34.196.204.54",
    "port": "9012",
    "initail_domain": "/api"
}


PAGESIZE = 10
PAGENUMBER = 1

HDFS = {

    # Give host name without http
    'host': 'ec2-34-205-203-38.compute-1.amazonaws.com',
    'port': '14000', #webhdfs port
    'uri': 'webhdfs/v1',
    'user.name': 'hadoop',
    'hdfs_port': '8020', #hdfs port
    'base_path' : '/dev/dataset/'
}

JOBSERVER = {
    'host': 'ec2-34-205-203-38.compute-1.amazonaws.com',
    'port': '8090',
    'app-name': 'test_api_1',
    'context': 'pysql-context',
    'class_path_master': 'bi.sparkjobs.madvisor.JobScript',
    'class_path_metadata': 'bi.sparkjobs.metadata.JobScript',
    'class_path_filter': 'bi.sparkjobs.filter.JobScript',

}

ANALYSIS_FOR_TARGET_VARIABLE = {
    "target_variable": {"dimension": [
        {"name": "Descriptive analysis", "id": "descriptive-analysis"},
        {"name": "Dimension vs. Dimension", "id": "dimension-vs-dimension"},
        {"name": "Predictive modeling", "id": "predictive-modeling"}
    ],
        "measure": [
            {"name": "Descriptive analysis", "id": "descriptive-analysis"},
            {"name": "Measure vs. Dimension", "id": "measure-vs-dimension"},
            {"name": "Measure vs. Measure", "id": "measure-vs-measure"}
        ], },
    "time_dimension" :{"name": "Trend", "id" : "trend", "help_text" : "Enable this analysis type only if date columns is present in selected variables"}
}
# {"name":"Trend":"id":4} will be added to the above lists based on the logic(if date columns is present or not)
