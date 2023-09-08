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
      <em>No more items</em>
    </p>
  </div>
</template>
