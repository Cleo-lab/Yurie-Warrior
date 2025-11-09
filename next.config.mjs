/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <-- Добавь эту строку
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Это нужно, потому что GitHub Pages не поддерживает оптимизацию изображений
  },
  // trailingSlash: true, // (Опционально) Если хочешь, чтобы URLs были с "/" в конце
}

export default nextConfig