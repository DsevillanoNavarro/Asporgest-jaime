from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter

from . import views
from .views import IncidenciaViewSet, api_login

router = DefaultRouter()
router.register(r'incidencias', IncidenciaViewSet, basename='incidencias')

urlpatterns = [
    path('', views.index, name='index'),
    path('bienvenida/', views.bienvenida, name='bienvenida'),
    path('registro/', views.registro_usuario, name='registro_usuario'),
    path('administracion/', views.administracion, name='administracion'),
    path('incidencias/', views.listar_incidencias, name='listar_incidencias'),
    path('incidencias/crear/', views.crear_incidencia, name='crear_incidencia'),
    path('incidencias/<int:id>/', views.ver_incidencia, name='ver_incidencia'),
    path('incidencias/<int:id>/eliminar/', views.eliminar_incidencia, name='eliminar_incidencia'),
    path('incidencias/modificar/<int:id>/', views.modificar_incidencia, name='modificar_incidencia'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/whoami/', views.whoami, name='whoami'),
    path('api/crear_usuario/', views.crear_usuario_api, name='crear_usuario_api'),
    path('api/usuarios/', views.listar_usuarios_api, name='listar_usuarios_api'),
    path('api/csrf/', views.csrf_token_view),
    path('api/', include(router.urls)),
]
