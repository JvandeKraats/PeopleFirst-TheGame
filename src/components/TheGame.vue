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
    submitAnswers() {
      
      this.$router.push('/result');
    },
  },
};
</script>

<template>
  <div>
    <p>Guess who is that: {{ collegas[currentIndex].Name }}</p>
    <p v-if="currentIndex < collegas.length - 1">
      <button @click="nextItem">Next</button>
    </p>
    <p v-else>
      <button @click="submitAnswers">Submit answers</button>>
    </p>
  </div>
</template>
