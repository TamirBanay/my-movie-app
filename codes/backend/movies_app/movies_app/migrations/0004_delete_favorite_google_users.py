# Generated by Django 4.2.5 on 2023-10-17 13:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('movies_app', '0003_rename_favoritegoogleusers_favorite_google_users'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Favorite_Google_Users',
        ),
    ]