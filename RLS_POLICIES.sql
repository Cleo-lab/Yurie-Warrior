-- ============================================
-- Row Level Security (RLS) Policies for Admin-Only Access
-- ============================================
-- Только пользователь с email cleopatrathequeenofcats@gmail.com может изменять данные
-- ============================================

-- 1. POSTS TABLE - RLS для постов
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Все могут читать посты
CREATE POLICY "Allow public to read posts" ON posts
  FOR SELECT USING (true);

-- Только админ может создавать посты
CREATE POLICY "Allow admin to insert posts" ON posts
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );

-- Только админ может обновлять посты
CREATE POLICY "Allow admin to update posts" ON posts
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );

-- Только админ может удалять посты
CREATE POLICY "Allow admin to delete posts" ON posts
  FOR DELETE USING (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );

-- 2. GALLERY TABLE - RLS для галереи
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Все могут читать галерею
CREATE POLICY "Allow public to read gallery" ON gallery
  FOR SELECT USING (true);

-- Только админ может добавлять в галерею
CREATE POLICY "Allow admin to insert gallery" ON gallery
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );

-- Только админ может обновлять галерею
CREATE POLICY "Allow admin to update gallery" ON gallery
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );

-- Только админ может удалять из галереи
CREATE POLICY "Allow admin to delete gallery" ON gallery
  FOR DELETE USING (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );

-- 3. COMMENTS TABLE - RLS для комментариев
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Все могут читать комментарии
CREATE POLICY "Allow public to read comments" ON comments
  FOR SELECT USING (true);

-- Только админ может создавать комментарии (ответы администратора)
CREATE POLICY "Allow admin to insert comments" ON comments
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );

-- Только админ может обновлять комментарии
CREATE POLICY "Allow admin to update comments" ON comments
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );

-- Только админ может удалять комментарии
CREATE POLICY "Allow admin to delete comments" ON comments
  FOR DELETE USING (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );

-- 4. NEWSLETTER_SUBSCRIBERS TABLE - RLS для подписчиков
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Все могут читать список подписчиков (для рассылки)
CREATE POLICY "Allow public to read subscribers" ON newsletter_subscribers
  FOR SELECT USING (true);

-- Все могут подписаться
CREATE POLICY "Allow anyone to subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Только админ может удалять подписчиков
CREATE POLICY "Allow admin to delete subscribers" ON newsletter_subscribers
  FOR DELETE USING (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );

-- Только админ может обновлять подписчиков
CREATE POLICY "Allow admin to update subscribers" ON newsletter_subscribers
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'cleopatrathequeenofcats@gmail.com'
  );
