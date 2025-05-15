from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.utils.timezone import now
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from .models import Incidencia
from .forms import IncidenciaForm, GestionIncidenciaForm
from .serializers import IncidenciaSerializer

# ==========================
# AUTENTICACIÓN API
# ==========================

@csrf_exempt  
@api_view(['POST', 'OPTIONS'])  
@permission_classes([AllowAny])
def api_login(request):
    if request.method == 'OPTIONS':
        return Response(status=200) 

    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'success': True})
    return Response({'error': 'Credenciales inválidas'}, status=401)

@login_required
def whoami(request):
    return JsonResponse({
        'username': request.user.username,
        'is_superuser': request.user.is_superuser,
        'id': request.user.id,
    })

# ==========================
# USUARIOS (ADMIN)
# ==========================

@api_view(['POST'])
@permission_classes([IsAdminUser])
def crear_usuario_api(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Usuario y contraseña son obligatorios'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'El usuario ya existe'}, status=400)

    User.objects.create_user(username=username, password=password)
    return Response({'success': 'Usuario creado correctamente'}, status=201)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def listar_usuarios_api(request):
    usuarios = User.objects.all().values('id', 'username', 'is_superuser', 'is_active', 'date_joined')
    return Response(list(usuarios))

# ==========================
# VISTAS DJANGO
# ==========================

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

# ==========================
# API REST FRAMEWORK
# ==========================

class IncidenciaViewSet(ModelViewSet):
    serializer_class = IncidenciaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Incidencia.objects.all().order_by('-fecha_creacion')
        return Incidencia.objects.filter(creada_por=self.request.user).order_by('-fecha_creacion')

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(creada_por=self.request.user)

@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({'detail': 'CSRF cookie set'})