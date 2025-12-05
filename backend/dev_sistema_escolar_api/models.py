from django.contrib.auth.models import User
from django.db import models
from rest_framework.authentication import TokenAuthentication
from django.utils import timezone
class BearerTokenAuthentication(TokenAuthentication):
    keyword = "Bearer"


class Administradores(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False, default=None)
    clave_admin = models.CharField(max_length=255,null=True, blank=True)
    telefono = models.CharField(max_length=255, null=True, blank=True)
    rfc = models.CharField(max_length=255,null=True, blank=True)
    edad = models.IntegerField(null=True, blank=True)
    ocupacion = models.CharField(max_length=255,null=True, blank=True)
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        full_name = self.user.get_full_name() or self.user.username
        return f"Perfil del admin {full_name}"


class Alumnos(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    matricula = models.CharField(max_length=50, unique=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    curp = models.CharField(max_length=18, null=True, blank=True)
    rfc = models.CharField(max_length=13, null=True, blank=True)
    edad = models.PositiveIntegerField(null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    ocupacion = models.CharField(max_length=255, null=True, blank=True)
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Perfil del Alumno {self.user.get_full_name() or self.user.username}"


class Maestros(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    id_trabajador = models.CharField(max_length=50, unique=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    rfc = models.CharField(max_length=13, null=True, blank=True)
    cubiculo = models.CharField(max_length=255, null=True, blank=True)
    edad = models.IntegerField(null=True, blank=True)
    area_investigacion = models.CharField(max_length=255, null=True, blank=True)
    materias_json = models.JSONField(default=list, blank=True)
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Perfil del maestro {self.user.get_full_name() or self.user.username}"

class Evento(models.Model):
    # Opciones para el tipo de evento (para que no sea texto libre)
    TIPO_CHOICES = [
        ('CONFERENCIA', 'Conferencia'),
        ('TALLER', 'Taller'),
        ('SEMINARIO', 'Seminario'),
        ('EXAMEN', 'Examen'),
    ]

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    fecha_inicio = models.DateTimeField(default=timezone.now)
    fecha_fin = models.DateTimeField()
    ubicacion = models.CharField(max_length=100) # Ej: Aula 101, Auditorio
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='CONFERENCIA')
    
    # Esto es clave: cupo máximo. Si es 0, es ilimitado.
    cupo_maximo = models.PositiveIntegerField(default=30) 
    
    # Timestamps para saber cuándo se creó (buena práctica siempre)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} ({self.fecha_inicio.strftime('%d/%m %H:%M')})"
    

class Inscripcion(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name='inscripciones')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Esto evita que un alumno se inscriba 2 veces al mismo evento
        unique_together = ('evento', 'usuario')

    def __str__(self):
        return f"{self.usuario.email} - {self.evento.titulo}"