import type { MetadataRoute } from 'next';
import { getAllProjectSlugs } from '@/lib/projects-data';

const routes = [
  '',
  '/realisations',
  '/reserver',
  '/xpresite',
  '/xpresite/sur-mesure',
  '/mentions-legales',
  '/confidentialite',
];


const locales = ['fr', 'en'];
const baseUrl = 'https://programactor.pro';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  const projectSlugs = await getAllProjectSlugs();

  const staticEntries = locales.flatMap((locale) =>
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

  const projectEntries = locales.flatMap((locale) =>
    projectSlugs.map((slug) => ({
      url: `${baseUrl}/${locale}/realisations/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr/realisations/${slug}`,
          en: `${baseUrl}/en/realisations/${slug}`,
          'x-default': `${baseUrl}/fr/realisations/${slug}`,
        },
      },
    }))
  );

  return [...staticEntries, ...projectEntries];
}

