import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://ousiui.com'
const siteName = 'Ousi UI'
const siteDescription = 'A beautiful, accessible component library for Vue and Flutter. 74+ components built with Tailwind CSS v4, TypeScript, OKLCH color tokens, and dark mode support.'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],

  // SPA mode — OG meta tags are in app.head (static HTML)
  ssr: false,

  // ── SEO ──
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: `${siteName} | Component Library for Vue & Flutter`,
      titleTemplate: `%s | ${siteName}`,
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        // Primary
        { name: 'description', content: siteDescription },
        { name: 'author', content: 'Carlos Aroca' },
        { name: 'creator', content: 'Carlos Aroca' },
        { name: 'publisher', content: 'Carlos Aroca' },
        { name: 'keywords', content: 'vue, vue 3, flutter, component library, ui library, widget library, tailwind css, tailwind v4, typescript, dart, design system, accessible components, dark mode, ousi ui, vue components, flutter widgets' },
        { name: 'theme-color', content: '#0a0a0a' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'robots', content: 'index, follow' },
        { name: 'generator', content: 'Nuxt 3' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:title', content: `${siteName} | Component Library for Vue & Flutter` },
        { property: 'og:description', content: siteDescription },
        { property: 'og:url', content: siteUrl },
        { property: 'og:image', content: `${siteUrl}/og-image.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: `${siteName} | 74+ components for Vue & Flutter` },
        { property: 'og:locale', content: 'en_US' },

        // Twitter / X
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${siteName} | Component Library for Vue & Flutter` },
        { name: 'twitter:description', content: siteDescription },
        { name: 'twitter:image', content: `${siteUrl}/og-image.png` },
        { name: 'twitter:image:alt', content: `${siteName} | 74+ components for Vue & Flutter` },
        { name: 'twitter:creator', content: '@CarlosArocaC' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: siteUrl },
        // Preconnect to external resources
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      ],
      script: [
        // Structured data (JSON-LD)
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: siteName,
            description: siteDescription,
            url: siteUrl,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            author: {
              '@type': 'Person',
              name: 'Carlos Aroca',
              url: 'https://carlosaroca.com',
            },
            programmingLanguage: ['TypeScript', 'Vue', 'Dart', 'CSS'],
            softwareRequirements: 'Vue 3.5+ / Flutter 3.x, Tailwind CSS 4+',
          }),
        },
      ],
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['vue', 'vue-html', 'ts', 'typescript', 'bash', 'css', 'html', 'json'],
        },
      },
    },
  },

  css: ['~/assets/css/main.css'],

  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['82fa-138-117-84-220.ngrok-free.app', 'c44a-138-117-84-220.ngrok-free.app'],
    },
    resolve: {
      preserveSymlinks: true,
    },
    optimizeDeps: {
      force: true,
      include: [
        '@ousi-ui/vue',
        '@ousi-ui/core',
        '@floating-ui/vue',
        '@floating-ui/dom',
        'motion-v',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
    },
  },

  build: {
    transpile: ['@ousi-ui/vue', '@ousi-ui/core', '@ousi-ui/haptics', 'motion-v', '@floating-ui/vue'],
  },

  compatibilityDate: '2026-04-03',
})
