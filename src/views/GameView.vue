<script>
import TheGame from '../components/TheGame.vue'
import fallbackPeople from '../data/people-fallback.json'

function normalizePhotoUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const base = import.meta.env.BASE_URL
  if (url.startsWith('/')) return `${base}${url.slice(1)}`
  return new URL(url, base).href
}

export default {
  components: { TheGame },
  data() {
    return { myList: [], trackTime: false }
  },
  computed: {
    mode() {
      const raw = this.$route?.query?.mode
      const mode = (Array.isArray(raw) ? raw[0] : raw || 'hard').toString().toLowerCase()
      return mode === 'easy' ? 'easy' : 'hard'
    }
  },
  methods: {
    pickRandomTen(people) {
      const maxItems = Math.min(people.length, 10)
      const shuffled = people.slice().sort(() => Math.random() - 0.5)
      return shuffled.slice(0, maxItems)
    },
    mapToGameModel(p) {
      const firstName = (p.givenName || (p.displayName || '').split(' ')[0] || '').trim()
      return {
        id: p.id,
        name: p.displayName,
        firstName,
        answer: '',
        // use the JSON photo path exactly
        link: normalizePhotoUrl(p.photo || '/fallback-photos/fallback.jpg')
      }
    }
  },
  created() {
    const people = fallbackPeople?.value ?? []
    this.myList = this.pickRandomTen(people).map(this.mapToGameModel)

    // Read time tracking flag from query
    const timeFlag = this.$route?.query?.time
    this.trackTime = !!timeFlag
  }
}
</script>

<template>
  <TheGame :collegas="myList" :mode="mode" :trackTime="trackTime" />
</template>
