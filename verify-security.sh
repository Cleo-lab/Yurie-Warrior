#!/bin/bash
# 🚀 QUICK START - Security Setup
# Выполните эти команды по порядку

echo "🔐 ADMIN PANEL SECURITY SETUP"
echo "======================================"
echo ""

# Шаг 1
echo "✅ Шаг 1: Проверка файлов..."
if [ -f "RLS_POLICIES.sql" ]; then
  echo "   ✓ RLS_POLICIES.sql найден"
else
  echo "   ✗ RLS_POLICIES.sql НЕ найден!"
  exit 1
fi

if [ -f "ADMIN_SECURITY_SETUP.md" ]; then
  echo "   ✓ ADMIN_SECURITY_SETUP.md найден"
else
  echo "   ✗ ADMIN_SECURITY_SETUP.md НЕ найден!"
  exit 1
fi

echo ""

# Шаг 2
echo "✅ Шаг 2: Проверка удалённых папок..."
if [ ! -d "app/admin/login" ]; then
  echo "   ✓ app/admin/login удалена"
else
  echo "   ✗ app/admin/login всё ещё существует!"
  exit 1
fi

if [ ! -d "app/admin/newsletter" ]; then
  echo "   ✓ app/admin/newsletter удалена"
else
  echo "   ✗ app/admin/newsletter всё ещё существует!"
  exit 1
fi

if [ ! -d "app/api/admin" ]; then
  echo "   ✓ app/api/admin удалена"
else
  echo "   ✗ app/api/admin всё ещё существует!"
  exit 1
fi

echo ""
echo "✅ Проверка завершена успешно!"
echo ""
echo "======================================"
echo "📋 СЛЕДУЮЩИЕ ШАГИ:"
echo "======================================"
echo ""
echo "1. Откройте https://app.supabase.com"
echo "2. Выберите ваш проект"
echo "3. Перейдите в SQL Editor"
echo "4. Скопируйте содержимое RLS_POLICIES.sql"
echo "5. Вставьте в SQL Editor"
echo "6. Нажмите RUN"
echo ""
echo "Подробнее смотрите в RLS_SETUP_GUIDE.md"
echo ""
echo "======================================"
echo ""
