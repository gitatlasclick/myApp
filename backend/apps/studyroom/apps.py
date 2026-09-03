# backend/apps/studyroom/apps.py

from django.apps import AppConfig


class StudyroomConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.studyroom' 
    verbose_name = 'اتاق مطالعه'