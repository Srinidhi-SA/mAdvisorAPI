import hashlib
import string

import watson_developer_cloud.natural_language_understanding.features.v1 \
    as Features
from watson_developer_cloud.natural_language_understanding_v1 import NaturalLanguageUnderstandingV1

from settings import NUMBEROFTRIES, CACHESALT, TEMPDIR
from settings import natural_language_understanding_settings as nlu_settings


def clean_key(key):
    return "".join([x if x in string.ascii_lowercase else "" for x in key.lower()])


def normalize_date_time(date_string):
    """
    Understand "6 hours ago, and other formats and return curret date in YYYYMMDD"
    :param date_string:
    :return:
    """
    from datetime import datetime
    date = datetime.today()

    if "ago" in date_string:
        date = datetime.today()
    else:
        try:
            # mm/dd/yyyy
            date = datetime.strptime(date_string, "%m/%d/%Y").date()
        except:
            pass

        try:
            # 'Sep 29, 2017'
            date = datetime.strptime(date_string, "%b %d, %Y").date()
        except:
            pass

    print date
    return date


def get_data_from_bluemix(content_url_or_text, content=False):

    nl_understanding = cache_get(content_url_or_text)
    if not nl_understanding:
        natural_language_understanding = NaturalLanguageUnderstandingV1(
            username=nlu_settings.get("username"),
            password=nlu_settings.get("password"),
            version="2017-02-27")
        features = [
                Features.Entities(limit=100,emotion=True,sentiment=True),
                Features.Keywords(limit=100,emotion=True,sentiment=True),
                Features.Categories(),
                Features.Concepts(),
                Features.Sentiment(),
                Features.Emotion(),
                #     Features.Feature(),
                #     Features.MetaData(),
                Features.Relations(),
                Features.SemanticRoles(),

            ]
        # features = {"sentiment": {}, "keywords": {}}
        nl_understanding = None
        print "get_data_from_bluemix " *20
        print natural_language_understanding
        print features
        print content
        for i in range(NUMBEROFTRIES):
            try:
                if content == True:
                    nl_understanding = natural_language_understanding.analyze(
                        text=content_url_or_text,
                        features=features
                    )
                else:
                    nl_understanding = natural_language_understanding.analyze(
                        url=content_url_or_text,
                        features=features
                    )

                print nl_understanding
            except:
                print "FAILED "*10
                pass

            if nl_understanding:
                break

        cache_put(content_url_or_text, nl_understanding)

    return nl_understanding




def get_cache_file_name(input_key):

    m = hashlib.md5(CACHESALT + input_key)
    return TEMPDIR + m.hexdigest()


import pickle
import os

def cache_get(key):
    cache_file_name = get_cache_file_name(key)
    if os.path.isfile(cache_file_name):
        return pickle.load( open( cache_file_name, "rb" ) )
    else:
        return None

def cache_put(key, obj):

    pickle.dump(obj, open(get_cache_file_name(key), "wb"))