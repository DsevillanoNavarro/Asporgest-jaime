@echo off
echo 🛠️ Generando build de React...
cd frontend
call npm run build || exit /b
cd ..

echo 🧹 Limpiando archivos antiguos de Django...
rmdir /s /q static
mkdir static

echo 📂 Copiando archivos de React a Django...
xcopy frontend\build\static static /s /e /y

echo ✅ React copiado a Django correctamente.
pause
