<script>
import TheGame from '../components/TheGame.vue'

export default {
  components: {
    TheGame, // Register the TheGame component
  },
  data() {
    return {
      myList: [
        {
          "Name": "Patrick",
          "Image": "https://xpirit.com/wp-content/uploads/2021/11/patrick-de-kruijff.png",
          "Answer": null
        },
        {
          "Name": "Natascha",
          "Image": "https://xpirit.com/wp-content/uploads/2020/12/natascha-former.png",
          "Answer": null
        },
        {
          "Name": "Jasper",
          "Image": "https://xpirit.com/wp-content/uploads/2020/12/jasper-gilhuis.jpg",
          "Answer": null
        }
      ], // Your list of items
    };
  },
  methods: {
    randomizeList() {
      const maxItems = Math.min(this.originalList.length, 5);
      const shuffledList = this.originalList.slice().sort(() => Math.random() - 0.5);
      this.myList = shuffledList.slice(0, maxItems);
    },
  },
  created() {
    this.randomizeList(); // Call randomizeList when the component is created.
  },
};
</script>

<template>
  <TheGame :collegas="myList" />
</template>
