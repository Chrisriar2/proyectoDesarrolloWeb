from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views.bootstrap import VersionView
from dev_sistema_escolar_api.views.admin import AdminView, AdminsAll
from dev_sistema_escolar_api.views.maestro import MaestroView, MaestrosAll
from dev_sistema_escolar_api.views.alumno import AlumnoView, AlumnosAll
from dev_sistema_escolar_api.views.evento import EventoView, EventosAll
from dev_sistema_escolar_api.views.inscripcion import InscribirseEventoView, MisInscripcionesView
from dev_sistema_escolar_api.views import auth

urlpatterns = [
    path("admin/", admin.site.urls),
    # path("api-auth/", include("rest_framework.urls")),
    path("api/version/", VersionView.as_view(), name="api-version"),
    # Administradores
    path("api/admins/", AdminView.as_view(), name="api-admin-create"),
    path("api/admins-all/", AdminsAll.as_view(), name="api-admins-all"),
    # Alumnos
    path("api/alumnos/", AlumnoView.as_view(), name="api-Alumno-create"),
    path("api/alumnos-all/", AlumnosAll.as_view(), name="api-alumnos-all"),
    # Maestros
    path("api/maestros/", MaestroView.as_view(), name="api-maestro-create"),
    path("api/maestros-all/", MaestrosAll.as_view(), name="api-maestros-all"),
    #Login
        path('token/', auth.CustomAuthToken.as_view()),
    #Logout
        path('logout/', auth.Logout.as_view()),
    #fokin eventos
    path('api/eventos-all/', EventosAll.as_view(), name='eventos_all'),
    path('api/evento/', EventoView.as_view(), name='evento_crud'),
    #fokin inscripciones
    path('inscribirse/', InscribirseEventoView.as_view(), name='inscribirse'),
    path('mis-inscripciones/', MisInscripcionesView.as_view(), name='mis_inscripciones'),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
