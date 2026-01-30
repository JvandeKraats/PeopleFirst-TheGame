<script>
import MemoryGame from '../components/MemoryGame.vue'

export default {
  components: {
    MemoryGame,
  },
  methods: {
    goToMainPage() {
      this.$router.push('/')
    },
  },
}
</script>

<template>
  <MemoryGame @return-to-main="goToMainPage" />
</template>
