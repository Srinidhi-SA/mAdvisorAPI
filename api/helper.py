from django.conf import settings
JOBSERVER = settings.JOBSERVER
THIS_SERVER_DETAILS = settings.THIS_SERVER_DETAILS


class JobserverDetails(object):
    @classmethod
    def get_jobserver_url(cls):
        return "http://" + JOBSERVER.get('host') + ":" + JOBSERVER.get('port')

    @classmethod
    def get_app(cls):
        return JOBSERVER.get('app-name')

    @classmethod
    def get_context(cls):
        return JOBSERVER.get('context')

    @classmethod
    def get_class_path(cls, name):
        if name not in JOBSERVER:
            raise Exception('No such class.')
        return JOBSERVER.get(name)

    @classmethod
    def get_config(cls, slug, class_name):

        job_type = {
            "metadata": "metaData",
            "master": "story",
        }

        return {
            "job_config": {
                "job_type": job_type[class_name],
                "job_url" : "http://{0}:{1}/api/job/{2}/".format(THIS_SERVER_DETAILS.get('host'),
                                                                    THIS_SERVER_DETAILS.get('port'),
                                                                    slug),
                "get_config" :
                    {
                        "action" : "get_config" ,
                        "method" : "GET"
                    },
                "set_result" :

                    {
                        "action" : "result",
                        "method"  : "PUT"
                    }
            }
        }

    @classmethod
    def print_job_details(cls, job):
        job_url = "{0}/jobs/{1}".format(cls.get_jobserver_url(), job.jobId)
        print "job_url: {0}".format(job_url)
        return job_url


def find_chart_data_and_replace_with_chart_data(data):
    columnData = data['columnData']

    for data in columnData:
        data["chartData"] = chartData

    data['columnData'] = columnData
    return data

chartData = {
      "data": {
          "columns": [
              ["data1", 30, 200, 100, 400, 150, 250],
              ["data2", 130, 100, 140, 200, 150, 50]
          ],
          "type": "bar",
      },
      "bar": {
          "width": {
              "ratio": 0.5
          }
      }

    }