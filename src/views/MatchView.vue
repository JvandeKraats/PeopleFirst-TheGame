<script>
import MatchNameToPictures from '../components/MatchNameToPictures.vue'
import fallbackPeople from '../data/people-fallback.json'

function normalizePhotoUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const base = import.meta.env.BASE_URL
  if (url.startsWith('/')) return `${base}${url.slice(1)}`
  return new URL(url, base).href
}

export default {
  components: { MatchNameToPictures },
  data() {
    return { myList: [], allPeople: [] }
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
        link: normalizePhotoUrl(p.photo || '/fallback-photos/fallback.jpg')
      }
    }
  },
  created() {
    const people = fallbackPeople?.value ?? []
    this.allPeople = people.map(this.mapToGameModel)
    this.myList = this.pickRandomTen(people).map(this.mapToGameModel)
  }
}
</script>

<template>
  <MatchNameToPictures :targets="myList" :allPeople="allPeople" />
</template>
