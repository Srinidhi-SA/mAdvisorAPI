import generic_crawler
import process
import common_utils
import simplejson as json
import urllib
import sys
from django.template.defaultfilters import slugify
import random
import string
import api.StockAdvisor.utils as myutils

def crawl_extract(urls,regex_dict={},remove_tags=[]):
	all_data=[]
	crawl_obj=generic_crawler.GenericCrawler()
	fobj=open("/tmp/stock_info.json","w")
	for url in urls:
		content=crawl_obj.get_data(url)
		json_list=[]
		if 'finance.google.com/finance?' in url:
			json_list=process.process_json_data(url,content,regex_dict=regex_dict)
		else:
			json_list=process.process_data(url,content,regex_dict=regex_dict,remove_tags=remove_tags)

		for json_obj in json_list:
			if not json_obj.get("url"):
				continue
			if "date" in json_obj:
				json_obj["date"] = myutils.normalize_date_time(json_obj.get("date","1 min ago")).strftime("%Y%m%d")
			fobj.write(json.dumps(json_obj)+"\n")
			all_data.append(json_obj)
	fobj.close()
	return all_data

def random_but_cool_stuff():
    stock_symbols = ['googl', 'aapl']
    GOOGLE_REGEX_FILE = "nasdaq_stock.json"
    from api.StockAdvisor.crawling.common_utils import get_regex
    extracted_data = crawl_extract(
        urls=generate_urls_for_historic_data(stock_symbols),
        regex_dict=get_regex(GOOGLE_REGEX_FILE)
    )
    return extracted_data


def fetch_news_article_from_nasdaq(stock_symbols):
    all_data = []
    crawl_obj = generic_crawler.GenericCrawler()
    for stock in stock_symbols:
        url = get_nasdaq_news_article(stock)
        print url
        content = crawl_obj.get_data(url)
        json_list = process.process_nasdaq_news_article(url, content, stock=stock)
        print json_list
        for json_obj in json_list:
            if not json_obj.get("url"):
                continue
            # if "date" in json_obj:
            #     json_obj["date"] = myutils.normalize_date_time(json_obj.get("date", "1 min ago")).strftime("%Y%m%d")
            # fobj.write(json.dumps(json_obj) + "\n")
            all_data.append(json_obj)
    return all_data


def generate_urls_for_historic_data(list_of_company_name):
	return ["http://www.nasdaq.com/symbol/{0}/historical".format(name) for name in list_of_company_name]

def generate_urls_for_crawl_news(stock_symbols):
	return ["https://finance.google.com/finance/company_news?q=NASDAQ:{}".format(stock_symbol.upper()) for stock_symbol in stock_symbols]

def get_nasdaq_news_article(stock_symbol):
    return "http://www.nasdaq.com/symbol/{0}/news-headlines".format(stock_symbol)

# columnData, headers, sampledata, metadata
def convert_crawled_data_to_metadata_format(news_data, other_details=None):
    if other_details is None:
        type = 'news_data'
    else:
        type= other_details['type']

    headers = find_headers(news_data=news_data, type=type)
    columnData = get_column_data_for_metadata(headers)
    sampleData = get_sample_data(news_data=news_data, type=type)
    metaData = get_metaData(news_data=news_data)
    transformation_settings = get_transformation_settings()
    #
    # return {
    #     "headers": headers,
    #     "sampleData": sampleData,
    #     "columnData": columnData,
    #     "metaData": metaData,
    #     "transformation_settings": transformation_settings
    # }

    return {
        'scriptMetaData': {
            'columnData': columnData,
            'headers': headers,
            'metaData': metaData,
            'sampleData': sampleData
        },
        'uiMetaData': {
            'advanced_settings': {},
            'columnDataUI': columnData,
            'headersUI': headers,
            'metaDataUI': metaData,
            'possibleAnalysis': '',
            'sampleDataUI': sampleData,
            'transformation_settings': transformation_settings,
            'varibaleSelectionArray': []
        }
    }

def transform_into_uiandscripts_metadata():
    return {
        'scriptMetaData': {
            'columnData': '',
            'headers': '',
            'metaData': '',
            'sampleData': ''
        },
        'uiMetaData': {
            'advanced_settings': '',
            'columnDataUI': '',
            'headersUI': '',
            'metaDataUI': '',
            'possibleAnalysis': '',
            'sampleDataUI': '',
            'transformation_settings': '',
            'varibaleSelectionArray': ''
        }
    }


def get_transformation_settings():
    return {
            "existingColumns": []
        }

def find_headers(news_data, type='historical_data'):
    headers_name = news_data[0].keys()
    required_fields = get_required_fields(type)

    headers_name = list(set(required_fields).intersection(set(headers_name)))
    headers = []
    for header in headers_name:
        temp = {}
        temp['name'] = header
        temp['slug'] = generate_slug(header)
        headers.append(temp)
    return headers

def get_column_data_for_metadata(headers):
    import copy
    sample_column_data = {
                "ignoreSuggestionFlag": False,
                "name": None,
                "chartData": None,
                "dateSuggestionFlag": False,
                "columnStats": None,
                "columnType": None,
                "ignoreSuggestionMsg": None,
                "slug": None,
                "consider": True
            }

    columnData = []
    for header in headers:
        temp = copy.deepcopy(sample_column_data)
        temp['name'] = header['name']
        temp['slug'] = header['slug']
        columnData.append(temp)

    return columnData

def get_sample_data(news_data, type='historical_data'):
    required_fields = get_required_fields(type)
    return [ [row[key] for key in required_fields] for row in news_data ]

def get_metaData(news_data):
    # return  [{
    #             "displayName": "Number of records",
    #             "name": "noOfRows",
    #             "value": len(news_data),
    #             "display": True
    #         },
    #     {
    #         "displayName": "Source",
    #         "name": "source",
    #         "value": "Google Finance",
    #         "display": True
    #     },
    #
    #          ]

    return [
        {"displayName": "News source", "name": "newsSource", "value": "Google Finance", "display": True},
        {"displayName": "Stock Prices", "name": "stockPrices", "value": "NASDAQ", "display": True},
        {"displayName": "Number of Articles", "name": "numberOfArticles", "value": 1249 , "display": True},
    ]

def get_required_fields(type='historical_data'):
    matching = {
        'historical_data': ['url',  'source', 'date'],
        'news_data': ['url',  'source', 'date', 'title','desc'],
    }

    return matching[type]

def generate_slug(name=None):

    return slugify(str(name) + "-" + ''.join(
        random.choice(string.ascii_uppercase + string.digits) for _ in range(10)))
