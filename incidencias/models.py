from django.db import models
from django.contrib.auth.models import User

class Empleado(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    departamento = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class Dispositivo(models.Model):
    TIPO_CHOICES = [
        ('PC', 'Ordenador'),
        ('LT', 'Portátil'),
        ('PR', 'Impresora'),
        ('OT', 'Otro'),
    ]

    tipo = models.CharField(max_length=2, choices=TIPO_CHOICES)
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    numero_serie = models.CharField(max_length=100, unique=True)
    asignado_a = models.ForeignKey(Empleado, null=True, blank=True, on_delete=models.SET_NULL)
    fecha_compra = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.tipo} - {self.marca} {self.modelo}"


class Incidencia(models.Model):
    CENTROS = [
        ('CENTRAL', 'CENTRAL'),
        ('CPM I', 'CPM I'),
        ('CPM II', 'CPM II'),
        ('RGA III', 'RGA III'),
        ('CPM IV', 'CPM IV'),
        ('DISL V', 'DISL V'),
        ('CPM VII', 'CPM VII'),
        ('CPM X', 'CPM X'),
        ('ISL XI', 'ISL XI'),
        ('ISL XII', 'ISL XII'),
        ('ISL XIII', 'ISL XIII'),
        ('CAL XIV', 'CAL XIV'),
        ('CPM XV', 'CPM XV'),
    ]
    
    RELATIVA_A = [
        ('1', 'Línea y/o dispositivo telefónico corporativo'),
        ('2', 'Ordenador'),
        ('3', 'Internet'),
        ('4', 'Cuenta Corporativa GSuite'),
        ('5', 'Impresora'),
        ('6', 'Plataforma gestion.grupoanide.es'),
        ('7', 'Dispositivos personales autorizados'),
        ('8', 'Control de accesos'),
        ('9', 'Otro'),
    ]

    PRIORIDADES = [('Baja', 'Baja'), ('Media', 'Media'), ('Alta', 'Alta')]

    centro = models.CharField(max_length=50, choices=CENTROS)
    fecha = models.DateField()
    urgencia = models.BooleanField()
    prioridad = models.CharField(max_length=10, choices=PRIORIDADES)
    relativa = models.CharField(max_length=1, choices=RELATIVA_A)

    creada_por = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    vista_por_admin = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.get_relativa_display()} ({self.creada_por.username})"