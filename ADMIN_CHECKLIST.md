# 🔐 Admin Panel Security Checklist

## Быстрая настройка

### ✅ Шаг 1: Применить RLS политики в Supabase

- [ ] Открыть [Supabase Console](https://app.supabase.com)
- [ ] Выбрать проект
- [ ] Перейти в **SQL Editor**
- [ ] Скопировать содержимое `RLS_POLICIES.sql`
- [ ] Выполнить все SQL команды
- [ ] Убедиться, что ошибок нет

### ✅ Шаг 2: Проверить Supabase User

- [ ] В **Authentication > Users** найти `cleopatrathequeenofcats@gmail.com`
- [ ] Убедиться что email подтвержден (Email Confirmed: ✅)
- [ ] Установить безопасный пароль

### ✅ Шаг 3: Проверить в коде

- [ ] `app/middleware.ts` - блокирует `/admin/login` и `/admin/newsletter`
- [ ] `app/admin/blog/page.tsx` - проверяет email при загрузке
- [ ] `app/api/send-newsletter/route.ts` - проверяет JWT + email
- [ ] `/admin/login` папка - удалена ✅
- [ ] `/admin/newsletter` папка - удалена ✅
- [ ] `/api/admin/` папка - удалена ✅

### ✅ Шаг 4: Тестирование

#### Тест 1: Неавторизированный доступ
```
URL: /admin/blog
Ожидание: Blank page + redirect to /
```

#### Тест 2: Авторизированный доступ с неправильным email
```
Логин: other-user@gmail.com
URL: /admin/blog
Ожидание: Redirect to /
```

#### Тест 3: Авторизированный доступ с правильным email
```
Логин: cleopatrathequeenofcats@gmail.com
URL: /admin/blog
Ожидание: Админ-панель видна, все функции работают
```

#### Тест 4: Удаленные маршруты заблокированы
```
URL: /admin/login
Ожидание: Redirect to /

URL: /admin/newsletter
Ожидание: Redirect to /
```

#### Тест 5: API защищен
```bash
curl -X POST /api/send-newsletter \
  -H "Content-Type: application/json" \
  -d '{"postTitle":"test"}'
  
Ожидание: 401 Unauthorized
```

## 🎯 Security Layers

### 1️⃣ Middleware (`app/middleware.ts`)
```
/admin/blog       ✅ Пропускает дальше
/admin/login      ❌ Редирект на /
/admin/newsletter ❌ Редирект на /
```

### 2️⃣ Component (`app/admin/blog/page.tsx`)
```
if (!session) {
  router.replace('/') ← Редирект
}

if (session.user.email !== 'cleopatrathequeenofcats@gmail.com') {
  router.replace('/') ← Редирект
}
```

### 3️⃣ API (`app/api/send-newsletter/route.ts`)
```
if (!bearerToken) {
  return 401 ← Unauthorized
}

if (!user || user.email !== 'cleopatrathequeenofcats@gmail.com') {
  return 403 ← Forbidden
}
```

### 4️⃣ Database (RLS в Supabase)
```sql
-- Только админ может писать/обновлять/удалять
WHERE auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
```

## 📝 Что изменилось

| ДО | ПОСЛЕ |
|-----|--------|
| localStorage token | JWT от Supabase ✅ |
| Простая проверка пароля | Supabase Auth ✅ |
| `/admin/login` и `/admin/newsletter` | Только `/admin/blog` ✅ |
| Без RLS политик | RLS для всех таблиц ✅ |
| `Authorization: Bearer admin-token` | `Authorization: Bearer JWT` ✅ |

## 🚀 Готово!

После выполнения всех шагов:
- ✅ Admin panel на `/admin/blog`
- ✅ Только `cleopatrathequeenofcats@gmail.com` может войти
- ✅ Все операции защищены на 4 уровнях
- ✅ Старые маршруты удалены
- ✅ Нет утечек через API

---

**Если что-то не работает:**
1. Проверьте консоль браузера (F12 > Console)
2. Проверьте Supabase logs
3. Убедитесь, что RLS политики применены
4. Проверьте, что email в Supabase подтвержден
