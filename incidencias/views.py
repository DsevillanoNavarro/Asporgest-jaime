from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect, render
from .models import Incidencia
from .forms import IncidenciaForm

# Create your views here.
@login_required
def index(request):
    nuevas = 0
    if request.user.is_superuser:
        nuevas = Incidencia.objects.filter(vista_por_admin=False).count()
    
    return render(request, 'incidencias/index.html', {'nuevas_incidencias': nuevas})


def bienvenida(request):
    return render(request, 'incidencias/bienvenida.html')

@user_passes_test(lambda u: u.is_superuser)
def registro_usuario(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form = UserCreationForm()
    return render(request, 'incidencias/registro_usuario.html', {'form': form})

@login_required
@user_passes_test(lambda u: u.is_superuser)
def administracion(request):
    return render(request, 'incidencias/administracion.html')

@login_required
def listar_incidencias(request):
    if request.user.is_superuser:
        incidencias = Incidencia.objects.all().order_by('fecha_creacion')
    else:
        incidencias = Incidencia.objects.filter(creada_por=request.user).order_by('fecha_creacion')
    
    return render(request, 'incidencias/listar_incidencias.html', {
        'incidencias': incidencias
    })
    
@login_required
def crear_incidencia(request):
    if request.method == 'POST':
        form = IncidenciaForm(request.POST)
        if form.is_valid():
            incidencia = form.save(commit=False)
            incidencia.creada_por = request.user
            incidencia.save()
            return redirect('listar_incidencias')
    else:
        form = IncidenciaForm()
    
    return render(request, 'incidencias/crear_incidencia.html', {'form': form})