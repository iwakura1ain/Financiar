from django.db import models

# Create your models here.

class Stock(models.Model):
    ticker = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    sector = models.CharField(max_length=100)
    rating = models.IntegerField(default=0)
    desc = models.TextField(max_length=200, default="")

class Trade(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    date = models.DateField()

    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    adj_close = models.FloatField()
    volume = models.FloatField()




