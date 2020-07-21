#!/bin/sh

. ../myenv/bin/activate
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata apps.json


USER="dladmin"
PASS="thinkbig"
MAIL="admin@mail.com"
script="
from django.contrib.auth.models import User;

username = '$USER';
password = '$PASS';
email = '$MAIL';

if User.objects.filter(username=username).count()==0:
    User.objects.create_superuser(username, email, password);
    print('Superuser created.');
else:
    print('Superuser already exists.');
"
printf "$script" | python manage.py shell
#echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | python manage.py shell
python manage.py runserver 0.0.0.0:8000 
