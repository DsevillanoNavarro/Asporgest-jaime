#!/bin/bash

echo "🛠️  Generando build de React..."
cd frontend || exit
npm run build || exit

echo "📂 Copiando archivos a Django..."
rm -rf ../static/*
rm -f ../templates/index.html

cp -r build/static/* ../static/
cp build/index.html ../templates/

echo "✅ React copiado a Django correctamente."
