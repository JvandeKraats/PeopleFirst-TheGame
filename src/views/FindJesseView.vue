<script>
import FindJesseGame from '../components/FindJesseGame.vue';
import fallbackPeople from '../data/people-fallback.json';

export default {
  components: { FindJesseGame },
  data() {
    return {
      gridSize: 3,
      jesseCount: 0,
      collegas: [],
      refreshesRemaining: 1,
      jesseIds: [
        '71a6bb31-944f-41d9-a940-d8a0c6d41d02', // Jesse Houwing
        'c80ee885-4578-48ee-b159-b6600f6cb7cb', // Jesse Wellenberg
        'cbfa17e7-cf58-4866-8515-f6ae3ebbc94b'  // Jesse Swart
      ]
    };
  },
  created() {
    this.generateGrid();
  },
  methods: {
    generateGrid() {
      const allPeople = fallbackPeople?.value || [];
      
      // Separate Jesses from non-Jesses
      const jesses = allPeople.filter(p => this.jesseIds.includes(p.id));
      const nonJesses = allPeople.filter(p => !this.jesseIds.includes(p.id));
      
      // Random Jesse count (1-3)
      this.jesseCount = Math.floor(Math.random() * 3) + 1;
      
      // Pick random Jesses
      const selectedJesses = this.shuffleArray(jesses).slice(0, this.jesseCount);
      
      // Calculate how many non-Jesses we need
      const totalTiles = this.gridSize * this.gridSize;
      const nonJessesNeeded = totalTiles - this.jesseCount;
      
      // Pick random non-Jesses
      const selectedNonJesses = this.shuffleArray(nonJesses).slice(0, nonJessesNeeded);
      
      // Combine and shuffle
      const combined = [...selectedJesses, ...selectedNonJesses];
      this.collegas = this.shuffleArray(combined).map(p => ({
        id: p.id,
        firstName: p.givenName || (p.displayName || '').split(' ')[0] || '',
        name: p.displayName,
        link: p.photo || '/fallback-photos/fallback-avatar.png',
        isJesse: this.jesseIds.includes(p.id)
      }));
    },
    shuffleArray(arr) {
      return arr.slice().sort(() => Math.random() - 0.5);
    },
    handleRefresh() {
      if (this.refreshesRemaining > 0) {
        this.refreshesRemaining--;
        this.generateGrid();
      }
    },
    handleSubmit(score) {
      // Store score in localStorage
      localStorage.setItem('gameScore', JSON.stringify(score));
      
      // Navigate to result page
      this.$router.push('/result');
    }
  }
};
</script>

<template>
  <FindJesseGame
    :collegas="collegas"
    :grid-size="gridSize"
    :jesse-count="jesseCount"
    :refreshes-remaining="refreshesRemaining"
    @refresh="handleRefresh"
    @submit="handleSubmit"
  />
</template>
