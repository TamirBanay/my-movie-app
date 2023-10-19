# Generated by Django 4.2.5 on 2023-10-19 11:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0002_customuser_googleid_customuser_isgoogleuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='FaceBookD',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='isFaceBookUser',
            field=models.BooleanField(default=False),
        ),
    ]