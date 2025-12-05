from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import Group

class UserStatsView(APIView):
    def get(self, request):
        # Contar usuarios por grupo
        admins = Group.objects.get(name='administrador').user_set.count()
        maestros = Group.objects.get(name='maestro').user_set.count()
        alumnos = Group.objects.get(name='alumno').user_set.count()
        
        return Response({
            "administradores": admins,
            "maestros": maestros,
            "alumnos": alumnos,
            "total": admins + maestros + alumnos
        })