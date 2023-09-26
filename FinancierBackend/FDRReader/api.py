
from django.shortcuts import render
from rest_framework import generics

from .models import Stock
from .serializers import StockSerializer

from abc import abstractmethod

from .utils import get_ticker_data


import FinanceDataReader as fdr

# Create your views here.

#TODO: seperate into file
from rest_framework.response import Response
class APIQueryAndModelMixin:
    """
    Retrieve a model instance and query an api.
    """
    query_function = None
    
    def query_retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        api_data = self.query_api(request.GET, **kwargs)
       
        return Response({**serializer.data, "data": api_data})

    def query_api(self, query_params, *args, **kwargs):
        ticker = kwargs.get("ticker").upper()
        start = start if (start := query_params.get("start")) else "2020-01-01"
        end = end if (end := query_params.get("end")) else "2021-01-01"
        
        data = self.query_function(ticker, start, end)
        retval = []
        for d in data.iloc:
            #Trade.objects.update_or_create(**d)
            retval.append({**d})

        return retval
        
class StockList(generics.ListAPIView):
    queryset = Stock.objects.all()  # fixed variable names
    serializer_class = StockSerializer  # fixed variable names

    def get_queryset(self):
        queryset = Stock.objects.all()
        ticker = self.request.query_params.get('ticker')

        filter = {}
        for key, arg in self.request.query_params.items():
            filter[key] = arg

        return queryset.filter(**filter)
    
class StockDetail(generics.GenericAPIView, APIQueryAndModelMixin):
    queryset = Stock.objects.all()  # fixed variable names
    serializer_class = StockSerializer  # fixed variable names
    lookup_field = 'ticker'
    query_function = lambda self, ticker, start, end : fdr.DataReader(ticker, start, end)
        
    def get(self, request, *args, **kwargs):
        return self.query_retrieve(request, *args, **kwargs)


    





