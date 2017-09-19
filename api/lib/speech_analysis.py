"""Sample code to use the IBM Watson Speech to Text API.
See more at https://blog.rmotr.com.
"""
import json
import unittest

from watson_developer_cloud import SpeechToTextV1
import watson_developer_cloud.natural_language_understanding.features.v1 \
  as Features
from watson_developer_cloud.natural_language_understanding_v1 import NaturalLanguageUnderstandingV1

from django.conf import settings

nlu_settings = settings.NATURAL_LANGUAGE_UNDERSTANDING_SETTINGS
VOICE_TO_TEXT_SETTINGS = settings.VOICE_TO_TEXT_SETTINGS


class SpeechAnalyzer:
    filepath = ""  # Audio file path
    converted_text = ""
    nl_understanding = None # will store the understanding
    nl_understanding_nodestructure = None
    sentiment_score = None
    
    def __init__(self, filepath):
        self.filepath = filepath
        
    
    def convert_speech_to_text(self):

        stt = SpeechToTextV1(username=VOICE_TO_TEXT_SETTINGS.get("username"), password=VOICE_TO_TEXT_SETTINGS.get("password"))
        audio_file = open(self.filepath, "rb")
        return_json = stt.recognize(audio_file, content_type="audio/wav", speaker_labels=True)
        
        
        if "results" in return_json.keys() and "alternatives" in return_json.get("results")[0].keys() and "transcript" in return_json.get("results")[0].get("alternatives")[0].keys():
            self.converted_text = return_json.get("results")[0].get("alternatives")[0].get("transcript")

        return self.converted_text
    
    def understand_text(self):
        natural_language_understanding = NaturalLanguageUnderstandingV1(
            username=nlu_settings.get("username"),
            password=nlu_settings.get("password"),
            version="2017-02-27")

        self.nl_understanding = natural_language_understanding.analyze(
        text=self.converted_text,
        features=[
          Features.Entities(
            emotion=True,
            sentiment=True,
            limit=100
          ),
          Features.Keywords(
            emotion=True,
            sentiment=True,
            limit=100
          ),
          Features.Categories(),
          Features.Concepts(),
          Features.Sentiment(),
          Features.Emotion(),
        #     Features.Feature(),
        #     Features.MetaData(),
          Features.Relations(),
          Features.SemanticRoles(),
                  
        ]
        )
        
        return self.nl_understanding

    
    def generate_node_structure(self):
        
        list_of_cards = []
        emotions_card = ""
        if "emotion" in self.nl_understanding:
            try:
                emotions_html = "".join([ self.__get_emotions_html(item.get(), item.get("") ) for item in self.nl_understanding.get("emotion").get("document").get("emotion").items()])
                emotions_card = self.__generate_normal_card("Emotions", emotions_html)
            except:
                pass
        sentiment_card = ""
        if "sentiment" in self.nl_understanding:
            try:
                sentiment = self.nl_understanding.get("sentiment").get("document")
                sentiment_html = '<div class="sentiment-{}">Sentiment score: {}</div>'.format(sentiment.get("label"), sentiment.get("score") )
                sentiment_card = self.__generate_normal_card("Sentiment",sentiment_html)
                temp_card_data = sentiment_card.get("cardData")

                temp_card_data.append(self.__generate_c3_gauge_chart_card("Sentiment",sentiment.get("score")))
                sentiment_card["cardData"] = temp_card_data

                self.sentiment_score = sentiment.get("score")
                self.sentiment_score = sentiment.get("score")
            except:
                pass

        keywords_card = ""
        if "keywords" in self.nl_understanding:
            try:
                keywords = self.nl_understanding.get("keywords")
                keywods_html = " ".join( [ "<span>{}</span>".format(item.get("text")) for item in keywords])
                keywords_card = self.__generate_normal_card("Keywords",keywods_html)


                temp_card_data = keywords_card.get("cardData")
                temp_card_data.append(self.get_keywords_bar(keywords))
                keywords_card["cardData"] = temp_card_data
            except:
                pass
            
            
        categories_card = ""
        if "categories" in self.nl_understanding:
            try:
                categories_html = "".join([ "<span>{}</span> <span>{}</span>".format(item.get("label").split("/")[-1], item.get("score")) for item in self.nl_understanding.get("categories")])
                categories_card = self.__generate_normal_card("Categories", categories_html)

                categories = self.nl_understanding.get("categories")
                temp_card_data = categories_card.get("cardData")
                temp_card_data.append(self.get_categories_bar(categories))
                categories_card["cardData"] = temp_card_data
            except:
                pass
        #
        # entities_card = ""
        # if "entities" in self.nl_understanding:
        #     try:
        #         categories_html = "".join(
        #             ["<span>{}</span> <span>{}</span>".format(item.get("label").split("/")[-1], item.get("score")) for
        #              item in self.nl_understanding.get("categories")])
        #         categories_card = self.__generate_normal_card("Categories", categories_html)
        #
        #         categories = self.nl_understanding.get("categories")
        #         temp_card_data = categories_card.get("cardData")
        #         temp_card_data.append(self.get_categories_bar(categories))
        #         categories_card["cardData"] = temp_card_data
        #     except:
        #         pass

        simple_html_card = self.__generate_normal_card("", self.generate_para_html())


        if emotions_card:
            list_of_cards.append(emotions_card)
        if keywords_card:
            list_of_cards.append(keywords_card)
        if sentiment_card:
            list_of_cards.append(sentiment_card)
        if categories_card:
            list_of_cards.append(categories_card)

        if simple_html_card:
            list_of_cards.append(simple_html_card)

        self.nl_understanding_nodestructure = {
                "name": "Overview card",
                "slug": "fdfdfd_overview",
                "listOfNodes" : [],
                "listOfCards" : list_of_cards
            }

        return self.nl_understanding_nodestructure


    # def __get_emotions_html(self, emo, val):
    #     return '<div class="emotion-{}"><span class="emotion-title">{}</span><span class="emotion-percent">{}%</span></div>'.format(emo,emo,val*100)

    def __get_emotions_html(self, emo, val):

        return """
         <div class="col-md-4">
                 <img src="/static/assessts/images/{}.png" width="80" class="pull-left" >
                 <h2 class="pull-left"><small>{}</small><br> {}% </h2>
         </div>
         """.format(emo, emo, int(val * 100))

    def __generate_normal_card(self, name, html):
        return {
                "cardType": "normal",
                "name": name,
                "slug": self.genarate_slug(name),
                "cardData": [
                    {
                        "dataType": "html",
                        "data": "<h1>{}</h1>{}".format(name, html)   
                    }
                ]
            }

    def __generate_c3_gauge_chart_card(self, name, score):

        score = round(score, 2)
        gauge_c3_chart_data = {
            "dataType": "c3Chart",
            "data": {
                "chart_c3": {
                    "color": {
                        "threshold": {
                            "values": [
                                -1,
                                0,
                                0.5,
                                1
                            ],
                            "unit": "value"
                        },
                        # "pattern": [
                        #     "#FF0000",
                        #     "#F97600",
                        #     "#F6C600",
                        #     "#60B044"
                        # ]
                    },
                    "data": {
                        "type": "gauge",
                        "columns": [
                            [
                                "data",
                                score
                            ]
                        ]
                    },
                    "gauge": {
                        "label": {
                            "format" : ""
                        },
                        "max": 1,
                        "min": -1,
                        "width": 39
                    },
                    "size": {
                        "height": 180
                    }
                },
                "gauge_format": True
            }
        }

        return gauge_c3_chart_data

    def generate_para_html(self):
        emotions_sorted = sorted(self.nl_understanding.get("emotion").get("document").get("emotion").items(),
                                 key=lambda (key, val): val, reverse=True)
        (best_emotion, best_value) = emotions_sorted[0]
        (second_best_emotion, second_best_value) = emotions_sorted[1]
        keywords = self.nl_understanding.get("keywords")
        keywords_html = " and ".join(
            ["{} ({})".format(item.get("text"), round(item.get("relevance"), 2)) for item in keywords[:2]])

        categories_html = " and ".join(["<strong>{}</strong>".format(item.get("label").split("/")[-1]) for item in
                                    self.nl_understanding.get("categories")[:2]])

        return """The overall sentiment in the speech seems to be {} {}.
            The most predominant emotion is <strong>{}</strong> at around {}%.
            Another important emotion identified is  <strong>{}</strong> at {}%.
           mAdvisor identified {} keywords in the speech,
            {}
            having the highest relevance.
           The major categories are {}.
             """.format(self.nl_understanding.get("sentiment").get("document").get("label"),
                        round(self.nl_understanding.get("sentiment").get("document").get("score"), 2),
                        best_emotion, int(best_value * 100),
                        second_best_emotion, int(second_best_value * 100),
                        len(keywords),
                        keywords_html,
                        categories_html
                        )

    def genarate_slug(self, name):
        from django.template.defaultfilters import slugify
        import random
        import string
        return slugify(str(name) + "-" + ''.join(
            random.choice(string.ascii_uppercase + string.digits) for _ in range(10)))


    def get_bar_chart(self, data, rotate=False, x="label", y="score"):

        c3 = C3chart_ML(
            axes={
                "x": x,
                "y": y
            },
            label_text={
                "x": x,
                "y": y
            },
            data=data,
            axisRotation=rotate
        )
        details = c3.get_details()

        decoded_chart =  decode_and_convert_chart_raw_data(details)

        # del decoded_chart['chart_c3']['axis']['x']['tick']['format']
        # del decoded_chart['chart_c3']['axis']['y']['tick']['format']
        # del decoded_chart['yformat']

        return {
            "dataType": "c3Chart",
            "data": decoded_chart
        }


    def get_categories_bar(self, categories):

        data = categories
        return self.get_bar_chart(
            data=data
        )

    def get_keywords_bar(self, keywords):

        data = []

        for d in keywords:
            temp = {}
            temp['text'] = d.get('text')
            temp['score'] = d.get('sentiment').get('score')
            data.append(temp)

        return self.get_bar_chart(
            data=data,
            x='text',
            y='score'
        )

    def get_entities_bar(self, entities):

        data = []

        for d in entities:
            temp = {}
            temp['text'] = d.get('text')
            temp['relevance'] = d.get('relevance')
            data.append(temp)

        return self.get_bar_chart(
            data=data,
            x='text',
            y='relevance'
        )


from api.helper import decode_and_convert_chart_raw_data


class C3chart_ML(object):

    def __init__(self, **kwrgs):
        self.chart_type = kwrgs.get('chart_type', 'bar')
        self.axes = kwrgs.get('axes', {})
        self.label_text = kwrgs.get('label_text', {})
        self.types = kwrgs.get('types')
        self.axisRotation = kwrgs.get('axisRotation', False)
        self.yAxisNumberFormat = kwrgs.get('yAxisNumberFormat', ".2f")
        # self.y2AxisNumberFormat = kwrgs.get('y2AxisNumberFormat', False)
        self.showLegend = kwrgs.get('showLegend', False)
        self.hide_xtick = kwrgs.get('hide_xtick', False)
        self.subchart = kwrgs.get('subchart', False)
        self.rotate = kwrgs.get('rotate', False)
        self.data = kwrgs.get('data')
        self.legend = {}

    def get_details(self):

        return {
            'chart_type': self.chart_type,
            'axes': self.axes,
            'label_text': self.label_text,
            'types': self.types,
            'axisRotation': self.axisRotation,
            'yAxisNumberFormat': self.yAxisNumberFormat,
            'showLegend': self.showLegend,
            'hide_xtick': self.hide_xtick,
            'subchart': self.subchart,
            'rotate': self.rotate,
            'data': self.data,
            'legend': self.legend
        }

    def update_data(self, data):
        self.data = data

    def rotate_axis(self):
        self.axisRotation = True

    def update_axes(self, axes):
        self.axes = axes





class SpeechAnalyzerTest:
    def testSpeechToText(self):
        sa = SpeechAnalyzer("test/mohanbi.wav")
        sa.convert_speech_to_text()
        print json.dumps(sa.converted_text)
        pass
    
    def understand_text(self):
        pass
    pass


if __name__ == "__main__":

    sa = SpeechAnalyzer("test/mohanbi.wav")
#     sa.convert_speech_to_text()
    sa.converted_text = "I am calling regarding my cellphone details regarding the AD and D. center and %HESITATION my bills that's not in proper order can you get back to me "
    print json.dumps(sa.converted_text)
#     sa.understand_text()
    
    sa.nl_understanding = json.loads("""{"semantic_roles": [{"action": {"text": "calling", "verb": {"text": "call", "tense": "present"}, "normalized": "call"}, "sentence": "I am calling regarding my cellphone details regarding the AD and D. center and %HESITATION my bills that's not in proper order can you get back to me", "object": {"text": "regarding my cellphone details regarding the AD and D. center"}, "subject": {"text": "I"}}, {"action": {"text": "get", "verb": {"text": "get", "tense": "future"}, "normalized": "get"}, "sentence": "I am calling regarding my cellphone details regarding the AD and D. center and %HESITATION my bills that's not in proper order can you get back to me", "object": {"text": "to me"}, "subject": {"text": "you"}}], "emotion": {"document": {"emotion": {"anger": 0.128218, "joy": 0.023388, "sadness": 0.039954, "fear": 0.030219, "disgust": 0.022114}}}, "sentiment": {"document": {"score": -0.602607, "label": "negative"}}, "language": "en", "entities": [], "relations": [{"score": 0.941288, "type": "agentOf", "arguments": [{"text": "I", "entities": [{"text": "you", "type": "Person"}]}, {"text": "calling", "entities": [{"text": "calling", "type": "EventCommunication"}]}], "sentence": "I am calling regarding my cellphone details regarding the AD and D. center and %HESITATION my bills that's not in proper order can you get back to me"}], "keywords": [{"relevance": 0.986328, "text": "cellphone details", "emotion": {"anger": 0.128218, "joy": 0.023388, "sadness": 0.039954, "fear": 0.030219, "disgust": 0.022114}, "sentiment": {"score": -0.602607}}, {"relevance": 0.833305, "text": "proper order", "emotion": {"anger": 0.128218, "joy": 0.023388, "sadness": 0.039954, "fear": 0.030219, "disgust": 0.022114}, "sentiment": {"score": -0.602607}}, {"relevance": 0.670873, "text": "D. center", "emotion": {"anger": 0.128218, "joy": 0.023388, "sadness": 0.039954, "fear": 0.030219, "disgust": 0.022114}, "sentiment": {"score": -0.602607}}, {"relevance": 0.552041, "text": "HESITATION", "sentiment": {"score": -0.602607}}, {"relevance": 0.396277, "text": "bills", "emotion": {"anger": 0.128218, "joy": 0.023388, "sadness": 0.039954, "fear": 0.030219, "disgust": 0.022114}, "sentiment": {"score": -0.602607}}, {"relevance": 0.34857, "text": "AD", "emotion": {"anger": 0.128218, "joy": 0.023388, "sadness": 0.039954, "fear": 0.030219, "disgust": 0.022114}, "sentiment": {"score": -0.602607}}], "concepts": [], "usage": {"text_characters": 150, "features": 8, "text_units": 1}, "categories": [{"score": 0.301348, "label": "/finance/personal finance/lending/credit cards"}, {"score": 0.17561, "label": "/business and industrial"}, {"score": 0.165519, "label": "/technology and computing"}]}
    """)
    
    print json.dumps(sa.nl_understanding)
    
    sa.generate_node_structure()
    print "=" * 100
    print(json.dumps(sa.nl_understanding_nodestructure))


    
    
    