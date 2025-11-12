@echo off
REM 🚀 QUICK START - Security Setup (Windows)
REM Выполните этот скрипт из папки проекта

echo.
echo 🔐 ADMIN PANEL SECURITY SETUP
echo ======================================
echo.

REM Шаг 1
echo ✅ Шаг 1: Проверка файлов...
if exist "RLS_POLICIES.sql" (
  echo    ✓ RLS_POLICIES.sql найден
) else (
  echo    ✗ RLS_POLICIES.sql НЕ найден!
  exit /b 1
)

if exist "ADMIN_SECURITY_SETUP.md" (
  echo    ✓ ADMIN_SECURITY_SETUP.md найден
) else (
  echo    ✗ ADMIN_SECURITY_SETUP.md НЕ найден!
  exit /b 1
)

echo.

REM Шаг 2
echo ✅ Шаг 2: Проверка удалённых папок...
if not exist "app\admin\login" (
  echo    ✓ app\admin\login удалена
) else (
  echo    ✗ app\admin\login всё ещё существует!
  exit /b 1
)

if not exist "app\admin\newsletter" (
  echo    ✓ app\admin\newsletter удалена
) else (
  echo    ✗ app\admin\newsletter всё ещё существует!
  exit /b 1
)

if not exist "app\api\admin" (
  echo    ✓ app\api\admin удалена
) else (
  echo    ✗ app\api\admin всё ещё существует!
  exit /b 1
)

echo.
echo ✅ Проверка завершена успешно!
echo.
echo ======================================
echo 📋 СЛЕДУЮЩИЕ ШАГИ:
echo ======================================
echo.
echo 1. Откройте https://app.supabase.com
echo 2. Выберите ваш проект
echo 3. Перейдите в SQL Editor
echo 4. Скопируйте содержимое RLS_POLICIES.sql
echo 5. Вставьте в SQL Editor
echo 6. Нажмите RUN
echo.
echo Подробнее смотрите в RLS_SETUP_GUIDE.md
echo.
echo ======================================
echo.
pause
