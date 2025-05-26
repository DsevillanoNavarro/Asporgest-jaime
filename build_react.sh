#!/bin/bash

echo "🛠️  Generando build de React..."
cd frontend || exit
npm run build || exit

echo "📂 Copiando archivos a Django..."
rm -rf ../static/*
# NO BORRAR NI MOVER templates/index.html

cp -r build/static/* ../static/
# NO copiar index.html

echo "✅ React copiado a Django correctamente."