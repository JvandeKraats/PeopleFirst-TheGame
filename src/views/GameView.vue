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
          "Image": "https://xpirit.com/wp-content/uploads/2021/11/patrick-de-kruijff.png"
        },
        {
          "Name": "Natascha",
          "Image": "https://xpirit.com/wp-content/uploads/2020/12/natascha-former.png"
        },
        {
          "Name": "Jasper",
          "Image": "https://xpirit.com/wp-content/uploads/2020/12/jasper-gilhuis.jpg"
        }
      ], // Your list of items
    };
  },
};
</script>

<template>
  <TheGame :collegas="myList" />
</template>
