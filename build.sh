#!/bin/bash
echo "🚀 Iniciando build do backend..."
cd backend
echo "📦 Instalando dependências..."
npm install
echo "🔨 Compilando TypeScript..."
npm run build
echo "✅ Build concluído!" 