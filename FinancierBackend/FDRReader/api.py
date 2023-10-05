
from django.shortcuts import render
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models.query import QuerySet


from .models import Stock
from .serializers import StockSerializer
from .utils import query_fdr
from .mixins import APIQueryAndModelMixin, IncrementFieldMixin
from .pagination import StandardResultsSetPagination

import FinanceDataReader as fdr

# Create your views here.
class StockList(generics.ListAPIView):
    queryset = Stock.objects.all()  
    serializer_class = StockSerializer
    pagination_class = StandardResultsSetPagination
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['name', 'sector']

    def get_queryset(self):
        assert self.queryset is not None, (
            "'%s' should either include a `queryset` attribute, "
            "or override the `get_queryset()` method."
            % self.__class__.__name__
        )
        
        queryset = self.queryset
        if isinstance(queryset, QuerySet):
            # Ensure queryset is re-evaluated on each request.
            queryset = queryset.all()

        if (name := self.request.query_params.get("name")) is not None:
            queryset = queryset.filter(name__icontains=name)

        if (sector := self.request.query_params.get("sector")) is not None:
            queryset = queryset.filter(sector__icontains=sector)
            
        return queryset

    
class StockRate(generics.GenericAPIView, IncrementFieldMixin):
    queryset = Stock.objects.all()  
    serializer_class = StockSerializer
    lookup_field = "ticker"
    increment_field = "rating"
    
    def put(self, request, *args, **kwargs):    
        return self.increment(request, *args, **kwargs)
    
    
class StockDetail(generics.GenericAPIView, APIQueryAndModelMixin):
    queryset = Stock.objects.all()  # fixed variable names
    serializer_class = StockSerializer  # fixed variable names
    lookup_field = 'ticker'
    #query_function = lambda self, ticker, start, end : fdr.DataReader(ticker, start, end)
    query_function = query_fdr
        
    def get(self, request, *args, **kwargs):
        return self.query_retrieve(request, *args, **kwargs)


    





