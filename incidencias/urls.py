from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('bienvenida/', views.bienvenida, name='bienvenida'),
    path('registro/', views.registro_usuario, name='registro_usuario'),
    path('administracion/', views.administracion, name='administracion'),
    path('incidencias/', views.listar_incidencias, name='listar_incidencias'),
    path('incidencias/crear/', views.crear_incidencia, name='crear_incidencia'),
    path('incidencias/<int:id>/', views.ver_incidencia, name='ver_incidencia'),
    path('incidencias/<int:id>/eliminar/', views.eliminar_incidencia, name='eliminar_incidencia'),

]