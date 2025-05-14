from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.forms import UserCreationForm
from django.utils.timezone import now
from .models import Incidencia
from .forms import IncidenciaForm, GestionIncidenciaForm

# Create your views here.
@login_required
def index(request):
    nuevas = 0
    total = 0

    if request.user.is_superuser:
        nuevas = Incidencia.objects.filter(vista_por_admin=False).count()
        total = Incidencia.objects.count()
    elif request.user.is_authenticated:
        total = Incidencia.objects.filter(creada_por=request.user).count()

    return render(request, 'incidencias/index.html', {
        'nuevas': nuevas,
        'total': total,
    })


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
@user_passes_test(lambda u: u.is_superuser)
def listar_incidencias(request):
    nuevas = Incidencia.objects.filter(estado='nueva').order_by('-fecha_creacion')
    en_curso = Incidencia.objects.filter(estado='en_curso').order_by('-fecha_creacion')
    cerradas = Incidencia.objects.filter(estado='cerrada').order_by('-fecha_creacion')
    return render(request, 'incidencias/listar_incidencias.html', {
        'nuevas': nuevas,
        'en_curso': en_curso,
        'cerradas': cerradas
    })

@login_required
@user_passes_test(lambda u: u.is_superuser)
def modificar_incidencia(request, id):
    incidencia = get_object_or_404(Incidencia, id=id)
    if request.method == 'POST':
        form = GestionIncidenciaForm(request.POST, instance=incidencia)
        if form.is_valid():
            form.save()
            return redirect('listar_incidencias')
    else:
        form = GestionIncidenciaForm(instance=incidencia)
    return render(request, 'incidencias/modificar_incidencia.html', {'form': form, 'incidencia': incidencia})
    
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

@login_required
def ver_incidencia(request, id):
    incidencia = get_object_or_404(Incidencia, id=id)
    return render(request, 'incidencias/ver_incidencia.html', {'incidencia': incidencia})

@login_required
@user_passes_test(lambda u: u.is_superuser)
def eliminar_incidencia(request, id):
    incidencia = get_object_or_404(Incidencia, id=id)
    incidencia.delete()
    return redirect('listar_incidencias')

@login_required
def ver_incidencia(request, id):
    incidencia = get_object_or_404(Incidencia, id=id)
    return render(request, 'incidencias/ver_incidencia.html', {'incidencia': incidencia})
