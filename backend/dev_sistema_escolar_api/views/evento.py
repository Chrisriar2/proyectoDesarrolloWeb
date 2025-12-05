from django.db import transaction
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from dev_sistema_escolar_api.serializers import UserSerializer, EventoSerializer
from dev_sistema_escolar_api.models import Evento
from django.shortcuts import get_object_or_404

# CLASE 1: Listar todos los eventos (El equivalente a MaestrosAll)
class EventosAll(generics.ListAPIView): # Cambié a ListAPIView que es más semántico para GET
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        # Filtramos eventos futuros o todos 
        eventos = Evento.objects.all().order_by('fecha_inicio')
        
        # Serializamos
        eventos_lista = EventoSerializer(eventos, many=True).data
        
        return Response(eventos_lista, status=status.HTTP_200_OK)


# ---------------------------------------------------------------
# CLASE 2: CRUD Individual (El equivalente a MaestroView)
# ---------------------------------------------------------------
class EventoView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    '''
    Obtener un Evento por ID
    '''
    def get(self, request, *args, **kwargs):
        # Usamos request.GET.get('id') para mantener tu estilo de QueryParams
        evento_id = request.GET.get("id")
        evento = get_object_or_404(Evento, id=evento_id)
        serializer = EventoSerializer(evento, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    """
    Registrar nuevo Evento
    NOTA: Aquí es más simple que Maestros porque NO creamos un User nuevo,
    solo creamos el objeto Evento.
    """
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = EventoSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Si el serializer es válido, guardamos.
        # OJO: Si quieres guardar quién creó el evento, harías: serializer.save(organizador=request.user)
        evento = serializer.save()

        return Response({"evento_created_id": evento.id}, status=status.HTTP_201_CREATED)
    
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        # Buscamos el evento
        evento_id = request.data.get("id")
        evento = get_object_or_404(Evento, id=evento_id)

        # Actualizamos campos específicos manualmente (como en tu ejemplo)
        # O podemos usar el serializer con partial=True para ahorrar líneas
        
        # Opción A (Tu estilo manual explícito):
        evento.titulo = request.data.get("titulo", evento.titulo)
        evento.descripcion = request.data.get("descripcion", evento.descripcion)
        evento.fecha_inicio = request.data.get("fecha_inicio", evento.fecha_inicio)
        evento.fecha_fin = request.data.get("fecha_fin", evento.fecha_fin)
        evento.ubicacion = request.data.get("ubicacion", evento.ubicacion)
        evento.cupo_maximo = request.data.get("cupo_maximo", evento.cupo_maximo)
        evento.save()

        return Response({"message": "Evento actualizado correctamente", "evento": EventoSerializer(evento).data}, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def delete(self, request, *args, **kwargs):
        evento_id = request.GET.get('id')
        evento = get_object_or_404(Evento, id=evento_id)
        try:
            evento.delete()
            return Response({"details": "Evento eliminado"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"details": "Error al eliminar"}, status=status.HTTP_400_BAD_REQUEST)