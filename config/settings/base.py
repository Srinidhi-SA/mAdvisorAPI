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
        # 'rest_framework.authentication.SessionAuthentication',
        # 'rest_framework.authentication.BasicAuthentication',
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
},
                                 {
        "dataSourceType": "Hana",
        "dataSourceName" : "HANA",
        "formFields": [
            {
                "fieldType": "Input",
                "placeHolder": "Dataset Name",
                "labelName": "Name"
                },
            {
                "fieldType": "Input",
                "placeHolder": "host",
                "labelName": "Host"
                },
            {
                "fieldType": "Input",
                "placeHoplaceHolder": "port",
                "labelName": "Port",
                "defaultValue": 30015
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
    "host": "madvisordev.marlabsai.com", # shoudn't start with http://
    "port": "80",
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
    'class_path_filter': 'bi.sparkjobs.filter.JobScript'

}

ANALYSIS_FOR_TARGET_VARIABLE = {
    "target_variable": {
        "dimension": [
        {"name": "Descriptive analysis", "id": "descriptive-analysis", "display": "Overview"},
        {"name": "Dimension vs. Dimension", "id": "dimension-vs-dimension", "display": "Association"},
        {"name": "Predictive modeling", "id": "predictive-modeling", "display": "Prediction"}
    ],
        "measure": [
            {"name": "Descriptive analysis", "id": "descriptive-analysis", "display": "Overview"},
            {"name": "Measure vs. Dimension", "id": "measure-vs-dimension", "display": "Performance"},
            {"name": "Measure vs. Measure", "id": "measure-vs-measure", "display": "Influencer"},
            {"name": "Predictive modeling", "id": "predictive-modeling", "display": "Prediction"}
        ], },
    "time_dimension" :{"name": "Trend",
                       "id" : "trend",
                       "help_text" : "Enable this analysis type only if date columns is present in selected variables",
                       "display": "Trend"}
}

ANALYSIS_LIST = {
    "Descriptive analysis": "Overview",
    "Dimension vs. Dimension": "Association",
    "Predictive modeling": "Prediction",
    "Measure vs. Dimension": "Performance",
    "Measure vs. Measure": "Influencer",
    "Trend":"Trend",
    "Trend Analysis": "Trend"
}

REVERSE_ANALYSIS_LIST = {
    "Overview": "Descriptive analysis",
    "overview": "Descriptive analysis",
    "Association": "Dimension vs. Dimension",
    "association": "Dimension vs. Dimension",
    "Prediction": "Predictive modeling",
    "prediction": "Predictive modeling",
    "Performance": "Measure vs. Dimension",
    "performance": "Measure vs. Dimension",
    "Influencer": "Measure vs. Measure",
    "influencer": "Measure vs. Measure",
    "Trend": "Trend",
    "trend": "Trend",
    "Trend Analysis": "Trend",
    "trend analysis": "Trend"
}
# {"name":"Trend":"id":4} will be added to the above lists based on the logic(if date columns is present or not)

CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOW_METHODS = (
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
)

CORS_ALLOW_HEADERS = (
    'x-requested-with',
    'content-type',
    'accept',
    'origin',
    'authorization',
    'x-csrftoken'
)

JOBSERVER_STATUS = {
    'RUNNING': 'INPROGRESS',
    'FINISHED': 'SUCCESS',
    'ERROR': 'FAILED',
    'UNKNOWN': 'UNKNOWN',
    'KILLED': 'FAILED'
}

UI_VERSION = "0.1027"

ERROR_MESSAGE = {
    'upload_error': 'Code had a weakness. Now it is broken.'
}

BRIEF_INFO_CONFIG = {
    'number of rows': 'Number of Rows',
    'number of columns': 'Number of Coulmns',
    'number of measures': 'Number of Measures',
    'number of dimensions': 'Number of Dimensions',
    'number of time dimension': 'Number of Date',
    'created_by': 'Created By',
    'updated_at': 'Updated On',
    'variable selected': 'Variable Selected',
    'variable type': 'Variable Type',
    'dataset': 'Dataset',
    'analysis list': 'Analysis List',
    'train_test_split': 'Train Test Split',
    'algorithm name': 'Algorithm Name',
    'model': 'Model',
    'file_size': 'File Size',
    'audioset': 'Audio'
}

FIRST_ORDER = [
    'created_by',
    'updated_at',
]

SECOND_ORDER = [
    'dataset',
    'variable selected',
    'variable type',
    'audioset'
]

DATASET_ORDER = [
    'number of rows',
    'number of columns',
    'number of measures',
    'number of dimensions',
    'number of time dimension',
    'file_size'
]

THIRD_ORDER = [
    'analysis list',
    'train_test_split',
    'model',
    'algorithm name'
]

ORDER_DATASET = FIRST_ORDER + SECOND_ORDER + DATASET_ORDER
ORDER_SIGNAL = FIRST_ORDER + SECOND_ORDER + THIRD_ORDER
ORDER_TRAINER = FIRST_ORDER + SECOND_ORDER + THIRD_ORDER
ORDER_SCORE = FIRST_ORDER + SECOND_ORDER + THIRD_ORDER

ORDER_DICT = {
    'dataset': ORDER_DATASET,
    'signal': ORDER_SIGNAL,
    'trainer': ORDER_TRAINER,
    'score': ORDER_SCORE,
    'audioset': ORDER_DATASET
}



NATURAL_LANGUAGE_UNDERSTANDING_SETTINGS = {
          "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
          "username": "77961f39-ccaa-4cd7-b6cb-68d544f91ffb",
          "password": "hDbkLtb8rWgh"
        }
    
VOICE_TO_TEXT_SETTINGS = { 
        "url": "https://stream.watsonplatform.net/speech-to-text/api",
        "username": "3d7b6be9-17eb-4208-ad56-3d873700d5e7",
        "password": "UXiMa7qNp68f"
        }


ADVANCED_SETTINGS_FOR_POSSIBLE_ANALYSIS = {
        "dimensions": {
            "analysis": [
            {
                "name": "overview",
                "displayName": "Overview",
                "status": False,
                "analysisSubTypes": [],
                "noOfColumnsToUse":None
            },
            {
                "name": "trend",
                "displayName": "Trend",
                "status": False,
                "analysisSubTypes": [
                    {
                        "name": "overview",
                        "displayName": "Overview",
                        "status": False
                    },
                    {
                        "name": "factors that drive up",
                        "displayName": "Factors that drive up",
                        "status": False
                    },
                    {
                        "name": "factors that drive down",
                        "displayName": "Factors that drive down",
                        "status": False
                    },
                    {
                        "name": "forecast",
                        "displayName": "Forecast",
                        "status": False
                    }

                ],
                "noOfColumnsToUse": None
            },
            {
                "name": "prediction",
                "displayName": "Prediction",
                "status": False,
                "analysisSubTypes": [],
                "noOfColumnsToUse": None
            },
            {
                "name": "association",
                "displayName": "Association",
                "status": False,
                "analysisSubTypes": [],
                "noOfColumnsToUse": [
                    {
                        "name": "low",
                        "displayName": "Low",
                        "status": True,
                        "defaultValue":3
                    },
                    {
                        "name": "medium",
                        "displayName": "Medium",
                        "status": False,
                        "defaultValue":5
                    },
                    {
                        "name": "high",
                        "displayName": "High",
                        "status": False,
                        "defaultValue":8
                    },
                    {
                        "name": "custom",
                        "displayName": "Custom",
                        "status": False,
                        "defaultValue":3,
                        "value":None
                    }
                ]
            }
        ],
            "targetLevels":[],
            "trendSettings":[
                {"name":"Count","status":True},
                {"name":"Specific Measure","status":False,"selectedMeasure":None}
            ]
        },
        "measures": {
            "analysis": [
            {
                "name": "overview",
                "displayName": "Overview",
                "status": False,
                "analysisSubTypes": [],
                "noOfColumnsToUse": None
            },
            {
                "name": "trend",
                "displayName": "Trend",
                "status": False,
                "analysisSubTypes": [
                    {
                        "name": "overview",
                        "displayName": "Overview",
                        "status": False
                    },
                    {
                        "name": "factors that drive up",
                        "displayName": "Factors that drive up",
                        "status": False
                    },
                    {
                        "name": "factors that drive down",
                        "displayName": "Factors that drive down",
                        "status": False
                    },
                    {
                        "name": "forecast",
                        "displayName": "Forecast",
                        "status": False
                    }

                ],
                "noOfColumnsToUse": None
            },
            {
                "name": "performance",
                "displayName": "Performance",
                "status": False,
                "analysisSubTypes": [
                    {
                        "name": "overview",
                        "displayName": "Overview",
                        "status": False
                    },
                    {
                        "name": "Top Sublevel",
                        "displayName": "Top Sublevel",
                        "status": False
                    },
                    {
                        "name": "Trend for top Sublevel",
                        "displayName": "Trend for top Sublevel",
                        "status": False
                    }
                ],
                "noOfColumnsToUse": [
                    {
                        "name": "low",
                        "displayName": "Low",
                        "status": True,
                        "defaultValue":3
                    },
                    {
                        "name": "medium",
                        "displayName": "Medium",
                        "status": False,
                        "defaultValue":5
                    },
                    {
                        "name": "high",
                        "displayName": "High",
                        "status": False,
                        "defaultValue":8
                    },
                    {
                        "name": "custom",
                        "displayName": "Custom",
                        "status": False,
                        "defaultValue":3,
                        "value":None
                    }
                ],
            },
            {
                "name": "influencer",
                "displayName": "Influencer",
                "status": False,
                "analysisSubTypes": [
                    {
                        "name": "overview",
                        "displayName": "Overview",
                        "status": False
                    },
                    {
                        "name": "Key areas of Impact",
                        "displayName": "Key areas of Impact",
                        "status": False
                    },
                    {
                        "name": "Trend analysis",
                        "displayName": "Trend analysis",
                        "status": False
                    }
                ],
                "noOfColumnsToUse": [
                    {
                        "name": "low",
                        "displayName": "Low",
                        "status": True,
                        "defaultValue":3
                    },
                    {
                        "name": "medium",
                        "displayName": "Medium",
                        "status": False,
                        "defaultValue":5
                    },
                    {
                        "name": "high",
                        "displayName": "High",
                        "status": False,
                        "defaultValue":8
                    },
                    {
                        "name": "custom",
                        "displayName": "Custom",
                        "status": False,
                        "defaultValue":3,
                        "value":None
                    }
                ]
            },
            {
                "name": "prediction",
                "displayName": "Prediction",
                "status": False,
                "analysisSubTypes": [],
                "noOfColumnsToUse": None
            }
        ],
            "trendSettings":[
                {"name":"Count","status":False},
                {"name":"Specific Measure","status":True,"selectedMeasure":None}
            ]
        },
    }

TRANSFORMATION_SETTINGS_CONSTANT = {
    "columnSetting":
        [
            {"actionName":"delete","displayName":"Delete Column","status":False},
            {"actionName":"rename","displayName":"Rename Column","status":False,"newName":None},
            {"actionName":"replace","displayName":"Replace Values","status":False,"replacementValues":[]},
            {
                "actionName":"data_type",
                "displayName":"Change Datatype",
                "status":False,
                "listOfDataTypes":[
                    {"name":"numeric","displayName":"Numeric","status":False},
                    {"name":"text","displayName":"Text","status":False},
                ]
            }
        ],
    "new_columns":
        [
            {
            "newColName":None,
            "orderedColNames":[],
            "operators":[
                {"name":"+","displayName":"Addition","status":True},
                {"name":"-","displayName":"Sub dsada","status":False},
            ]
}
        ]

}

