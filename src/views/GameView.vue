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
      biggerList: [
        [
          { "name": "Henk", "imgUrl": "https://xpirit.com/people/henkboelman.jpg" },
          { "name": "Edwin", "imgUrl": "https://xpirit.com/people/edwinvdgraaf.jpg" },
          { "name": "Michelangelo", "imgUrl": "https://xpirit.com/people/michelangelonyc.jpg" },
          { "name": "Ronald", "imgUrl": "https://xpirit.com/people/ronaldharmsen.jpg" },
          { "name": "Jasper", "imgUrl": "https://xpirit.com/people/jaspergilhuis.jpg" },
          { "name": "Alex", "imgUrl": "https://xpirit.com/people/alexthissen.jpg" },
          { "name": "Marcel", "imgUrl": "https://xpirit.com/people/marcelv.jpg" },
          { "name": "Arie", "imgUrl": "https://xpirit.com/people/arieleeuwesteijn.jpg" },
          { "name": "Jonathan", "imgUrl": "https://xpirit.com/people/jonathanmezach.jpg" },
          { "name": "Xander", "imgUrl": "https://xpirit.com/people/xandermouthaan.jpg" },
          { "name": "Rene", "imgUrl": "https://xpirit.com/people/renevanosnabrugge.jpg" },
          { "name": "Chris", "imgUrl": "https://xpirit.com/people/chrisgeijskes.jpg" },
          { "name": "Roy", "imgUrl": "https://xpirit.com/people/roycornelissen.jpg" },
          { "name": "Michel", "imgUrl": "https://xpirit.com/people/michelvanverdegem.jpg" },
          { "name": "Marc", "imgUrl": "https://xpirit.com/people/marcduiker.jpg" },
          { "name": "Mathijs", "imgUrl": "https://xpirit.com/people/mathijsschuurmans.jpg" },
          { "name": "Sander", "imgUrl": "https://xpirit.com/people/sandermolenkamp.jpg" },
          { "name": "Pascal", "imgUrl": "https://xpirit.com/people/pascalnaber.jpg" },
          { "name": "Michiel", "imgUrl": "https://xpirit.com/people/michielrovers.jpg" },
          { "name": "Nelly", "imgUrl": "https://xpirit.com/people/nellysattari.jpg" },
          { "name": "Dmitri", "imgUrl": "https://xpirit.com/people/dmitribroekman.jpg" },
          { "name": "Danny", "imgUrl": "https://xpirit.com/people/dannytuppen.jpg" },
          { "name": "Ruben", "imgUrl": "https://xpirit.com/people/rubenverhoef.jpg" },
          { "name": "Sam", "imgUrl": "https://xpirit.com/people/sambos.jpg" },
          { "name": "Joost", "imgUrl": "https://xpirit.com/people/joostbrugman.jpg" },
          { "name": "Rinie", "imgUrl": "https://xpirit.com/people/riniekuyvenhoven.jpg" },
          { "name": "Dennis", "imgUrl": "https://xpirit.com/people/dennisdoomen.jpg" },
          { "name": "Derk", "imgUrl": "https://xpirit.com/people/derkgortemaker.jpg" },
          { "name": "Gert", "imgUrl": "https://xpirit.com/people/gertjandevries.jpg" },
          { "name": "Fanie", "imgUrl": "https://xpirit.com/people/faniereynders.jpg" },
          { "name": "Martijn", "imgUrl": "https://xpirit.com/people/martijncoster.jpg" },
          { "name": "Floyd", "imgUrl": "https://xpirit.com/people/floydhilton.jpg" },
          { "name": "Ivo", "imgUrl": "https://xpirit.com/people/ivodeboer.jpg" },
          { "name": "Maarten", "imgUrl": "https://xpirit.com/people/maartenballiauw.jpg" }
        ]
      ]
    };
  },
};
</script>

<template>
  <TheGame :collegas="myList" />
</template>
