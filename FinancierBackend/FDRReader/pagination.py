from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 21
    page_size_query_param = 'page_size'
    max_page_size = 1000


class PartialPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 1000
    flip = False

    def paginate_queryset(self, queryset, request, view=None):
        paginated = super().paginate_queryset(queryset, request, view=None)        
        return {
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': paginated,
        }

    
