from django.db import models

from FDRReader.models import Stock

# Create your models here.
class Comment(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    comment = models.TextField(max_length=200)


