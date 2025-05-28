#!/bin/bash
echo "⚛️ Compilando frontend..."
cd frontend
npm install
npm run build
cd ..
python manage.py collectstatic --noinput
