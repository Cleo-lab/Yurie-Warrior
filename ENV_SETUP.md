# ✅ ENVIRONMENT VARIABLES CHECK

## 📝 Supabase Environment Variables

Убедитесь что в вашем `.env.local` или на Vercel dashboard установлены:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key (для рассылки)
```

## ✅ Проверка Переменных

### 1. Supabase URL
```
NEXT_PUBLIC_SUPABASE_URL должна быть:
https://xxxxxxxxxxx.supabase.co
```

### 2. Supabase Anon Key
```
NEXT_PUBLIC_SUPABASE_ANON_KEY должна быть:
eyJhbGc... (очень длинный ключ)
```

### 3. Resend API Key (для рассылки)
```
RESEND_API_KEY должна быть:
re_xxxxxxxxxxxxxxxxx
```

## 🚀 Как добавить на Vercel

1. Откройте https://vercel.com
2. Выберите проект
3. Settings → Environment Variables
4. Добавьте три переменные выше
5. Redeploy

## ⚠️ ВАЖНО

Если переменные не установлены:
- ❌ Supabase не будет работать
- ❌ Рассылка не будет отправляться
- ❌ Admin panel может не работать

## ✨ После Добавления

Redeploy проекта:
1. Vercel Dashboard
2. Deployments
3. Нажми на последний deploy
4. Кликни "Redeploy"

Готово! 🚀

---

Дата: 12 November 2025
