from rest_framework import viewsets


class MultiSerializerViewSet(viewsets.ModelViewSet):
    """
    Use it to get multi-serializer in place of ModelViewSet :
    serializers = {
        'list':    serializers.ListaGruppi,
        'detail':  serializers.DettaglioGruppi,
        # etc.
    }
    """
    serializers = {
        'default': None,
    }

    def get_serializer_class(self):
        return self.serializers.get(self.action, self.serializers['default'])