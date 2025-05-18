from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('incidencias.urls')),  # Incluye todas las rutas de tu app
]
