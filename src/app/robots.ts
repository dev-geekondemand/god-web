import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/default',
          '/Default',
          '/default.aspx',
          '/Default.aspx',
          '/page/',
          '/index.html',
          '/home',
        ],
      },
    ],
    sitemap: 'https://www.geekondemand.in/sitemap.xml',
  }
}
