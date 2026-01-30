<script>
import TheGame from '../components/TheGame.vue'
import fallbackPeople from '../data/people-fallback.json'

export default {
  components: { TheGame },
  data() {
    return { myList: [] }
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
        link: p.photo || '/fallback-photos/fallback.jpg'
      }
    }
  },
  created() {
    const people = fallbackPeople?.value ?? []
    this.myList = this.pickRandomTen(people).map(this.mapToGameModel)
  }
}
</script>

<template>
  <TheGame :collegas="myList" :mode="mode" />
</template>
