import type { MetadataRoute } from 'next';

const routes = [
  '',
  '/realisations',
  '/reserver',
  '/xpresite',
  '/mentions-legales',
  '/confidentialite',
];

const locales = ['fr', 'en'];
const baseUrl = 'https://programactor.pro';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: currentDate,
      changeFrequency: (route === '' || route === '/realisations' || route === '/xpresite'
        ? 'weekly'
        : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 1.0 : route === '/reserver' || route === '/xpresite' ? 0.9 : 0.7,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr${route}`,
          en: `${baseUrl}/en${route}`,
          'x-default': `${baseUrl}/fr${route}`,
        },
      },
    }))
  );
}
