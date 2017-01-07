import subprocess
# import hadoopy
import json
import os
import os.path
from pywebhdfs.webhdfs import PyWebHdfsClient
from django.conf import settings

def hadoop_put(from_path, to_dir):
    to = to_dir + "/" + os.path.basename(from_path)
    print "Sending {} to: {}".format(from_path, to_dir)
    print "Reading the file {}".format(from_path)
    # subprocess.call(["/usr/local/hadoop/bin/hadoop", "fs", "-put", from_path, to])
    with open(from_path, 'r') as file:
        data = file.read()
    print "Creating on HDFS"

    hadoop_del_file(to)
    hdfs = hadoop_hdfs()
    print hdfs.create_file(to, data)

def hadoop_mkdir(path):
    print "Creating directory {}".format(path)
    # subprocess.call(["/usr/local/hadoop/bin/hadoop", "fs", "-mkdir", "-p", path])
    hadoop_hdfs().make_dir(path)

def hadoop_ls(path='/'):
    print "Looking for {}".format(path)
    # subprocess.call(["/usr/local/hadoop/bin/hadoop", "fs", "-ls", path])
    result = hadoop_hdfs().list_dir(path)
    print result
    return result['FileStatuses']['FileStatus']

def hadoop_r():
	subprocess.call(["/usr/local/hadoop/bin/hadoop"])

def hadoop_hdfs_url(path=''):
    return "hdfs://localhost:9000"

def hadoop_read_file(path='', parse_json = True):
    print "Reading file: " + path
    data = hadoop_hdfs().read_file(path)
    if parse_json :
        return json.loads(data.replace('\n', ''))
    return data

def hadoop_del_file(path):
    hadoop_hdfs().delete_file_dir(path)

def hadoop_read_output_file(path):
    list = hadoop_ls(path)
    for item in list:
        if item['length'] > 0:
            filled_part = path + "/" + item['pathSuffix']
            print("Found at: " + filled_part)
            return hadoop_read_file(filled_part)
    return {}

def hadoop_hdfs():
    conf = settings.HDFS
    return PyWebHdfsClient(host= conf['host'],port= conf['port'], user_name=conf['user.name'])
