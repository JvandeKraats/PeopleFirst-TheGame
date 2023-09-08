<script>
export default {
  props: {
    collegas: Array, // Define a prop for the list
  },
  data() {
    return {
      currentIndex: 0, // Start with the first item
    };
  },
  methods: {
    nextItem() {
      if (this.currentIndex < this.collegas.length - 1) {
        this.currentIndex++;
      }
    },
    prevousItem() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    submitAnswers() {
      var score = this.calculateScore();
      localStorage.setItem('gameScore', JSON.stringify(score));
      this.$router.push('/result');
    },
    calculateScore(){
      let score = 0;
      for (let i = 0; i < this.collegas.length; i++) {
        if (this.collegas[i].Answer === this.collegas[i].Name) {
          score++;
        }
      }
      return score;
    }
  },
};
</script>

<template>
  <div>
    <p>Guess who is that:</p>
    <img :src="collegas[currentIndex].Image" />
    <input type="text" v-model="collegas[currentIndex].Answer" />
    <p v-if="currentIndex < collegas.length - 1">
      <button @click="nextItem">Next</button>
      <button @click="prevousItem">Previous</button>
    </p>
    <p v-else>
      <button @click="submitAnswers">Submit answers</button>
    </p>
  </div>
</template>
