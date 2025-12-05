from rest_framework.views import APIView            
from rest_framework.response import Response        
from rest_framework import status, permissions      
from django.shortcuts import get_object_or_404      
from dev_sistema_escolar_api.models import Evento, Inscripcion

class InscribirseEventoView(APIView):
    permission_classes = (permissions.IsAuthenticated,) # Solo usuarios logueados

    def post(self, request, *args, **kwargs):
        evento_id = request.data.get("evento_id")
        usuario = request.user # El usuario que viene en el Token

        # 1. Validar que el evento exista
        evento = get_object_or_404(Evento, id=evento_id)

        # 2. Validar si ya está inscrito
        if Inscripcion.objects.filter(evento=evento, usuario=usuario).exists():
            return Response({"error": "Ya estás inscrito en este evento"}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Validar Cupo (Si cupo_maximo es 0, es ilimitado)
        conteo_actual = Inscripcion.objects.filter(evento=evento).count()
        if evento.cupo_maximo > 0 and conteo_actual >= evento.cupo_maximo:
             return Response({"error": "El evento está lleno"}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Inscribir
        Inscripcion.objects.create(evento=evento, usuario=usuario)
        
        return Response({"message": "Inscripción exitosa"}, status=status.HTTP_201_CREATED)

    # Método para des-inscribirse (borrar registro)
    def delete(self, request, *args, **kwargs):
        evento_id = request.GET.get("evento_id")
        usuario = request.user
        
        inscripcion = Inscripcion.objects.filter(evento_id=evento_id, usuario=usuario).first()
        
        if inscripcion:
            inscripcion.delete()
            return Response({"message": "Te has dado de baja del evento"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No estabas inscrito"}, status=status.HTTP_400_BAD_REQUEST)

# También necesitamos una vista rápida para saber a QUÉ eventos ya estoy inscrito
class MisInscripcionesView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        # Devuelve solo los IDs de los eventos donde estoy inscrito
        inscripciones = Inscripcion.objects.filter(usuario=request.user).values_list('evento_id', flat=True)
        return Response(inscripciones, status=status.HTTP_200_OK)