const REPO = 'carlosaroca/ousi-ui'
const CACHE_KEY = 'ousi-gh-stars'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

export function useGitHubStars() {
  const stars = ref<number | null>(null)

  function formatStars(count: number): string {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
    return String(count)
  }

  const displayText = computed(() => {
    if (stars.value === null) return null
    if (stars.value < 50) return 'Rate us on GitHub'
    return formatStars(stars.value)
  })

  const isEarly = computed(() => stars.value !== null && stars.value < 50)

  onMounted(async () => {
    // Try cache first
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const { count, ts } = JSON.parse(cached)
        if (Date.now() - ts < CACHE_TTL) {
          stars.value = count
          return
        }
      }
    } catch {}

    // Fetch from GitHub API
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      })
      if (res.ok) {
        const data = await res.json()
        stars.value = data.stargazers_count ?? 0
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ count: stars.value, ts: Date.now() }))
        } catch {}
      }
    } catch {}
  })

  return { stars, displayText, isEarly }
}
