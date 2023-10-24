#TODO: seperate into file
from rest_framework.response import Response
class IncrementFieldMixin:
    """
    Increment a value on request
    """
    increment_field = None

    def increment(self, request, *args, **kwargs):
        kwargs['partial'] = True
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if type(getattr(instance, self.increment_field)) != int:
            raise TypeError
        
        serializer = self.get_serializer(
            instance,
            data={
                self.increment_field: getattr(instance, self.increment_field)+1
            },
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        queryset = self.filter_queryset(self.get_queryset())
        if queryset._prefetch_related_lookups:
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance,
            # and then re-prefetch related objects
            instance._prefetched_objects_cache = {}
            prefetch_related_objects([instance], *queryset._prefetch_related_lookups)

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()
        
        
class APIQueryAndModelMixin:
    """
    Query an api and retrieve a model instance.
    """
    query_function = None
    
    def query_retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        api_data = self.query_api(request.GET, **kwargs)
        page = self.paginate_queryset(api_data)
        paginated_data = page.pop("results")

        return Response({
            **serializer.data,
            **page,
            "data": paginated_data
        })

    @classmethod
    def query_api(cls, query_params, *args, **kwargs):
        kwargs.update({k:v for k, v in query_params.items()})

        data = cls.query_function(**kwargs)
        retval = []
        for d in data.iloc:
            #Trade.objects.update_or_create(**d)
            retval.append({**d})

        return retval
        
