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
      <em>No more items</em>
    </p>
  </div>
</template>
