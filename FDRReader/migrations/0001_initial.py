# Generated by Django 4.2.4 on 2023-09-05 06:06

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticker', models.CharField(max_length=20)),
                ('name', models.CharField(max_length=100)),
                ('sector', models.CharField(max_length=100)),
            ],
        ),
    ]
