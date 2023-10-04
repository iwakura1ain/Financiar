# Generated by Django 4.2.4 on 2023-09-19 08:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('FDRReader', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Trade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('open', models.FloatField()),
                ('high', models.FloatField()),
                ('low', models.FloatField()),
                ('close', models.FloatField()),
                ('adj_close', models.FloatField()),
                ('volume', models.FloatField()),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FDRReader.stock')),
            ],
        ),
    ]