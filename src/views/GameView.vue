<script>
import TheGame from '../components/TheGame.vue'

export default {
  components: {
    TheGame, // Register the TheGame component
  },
  data() {
    return {
      myList: [], // Your list of items
      originalList:
        [
          {
            "name": "Kim Ellermann",
            "imgUrl": "/wp-content/uploads/2023/04/IMG_6315-600x400.jpg"
          },
          {
            "name": "Ilayda Gulcin Tezcan",
            "imgUrl": "/wp-content/uploads/2023/04/42466980-C16C-438D-BD6E-AB3343512560-437x600.png"
          },
          {
            "name": "Maira Camu",
            "imgUrl": "/wp-content/uploads/2020/12/maria-camu-xpirit.png"
          },
          {
            "name": "Suraj Sewbalak",
            "imgUrl": "/wp-content/uploads/2021/10/suraj-sewballak.png"
          },
          {
            "name": "Diederik Tiemstra",
            "imgUrl": "/wp-content/uploads/2021/10/diederik-tiemstra.png"
          },
          {
            "name": "Patrick de Kruijf",
            "imgUrl": "/wp-content/uploads/2021/11/patrick-de-kruijff.png"
          },
          {
            "name": "Anna Sollén",
            "imgUrl": "/wp-content/uploads/2023/07/Anna-team-pic-450x600.jpg"
          },
          {
            "name": "Marc Bruins",
            "imgUrl": "/wp-content/uploads/2020/12/mark-bruins-xpirit.png"
          },
          {
            "name": "Robert de Veen",
            "imgUrl": "/wp-content/uploads/2022/03/robert-de-veen.png"
          },
          {
            "name": "Roy Cornelissen",
            "imgUrl": "/wp-content/uploads/2020/12/roy-cornelisse.png"
          },
          {
            "name": "Geert van der Cruijsen",
            "imgUrl": "/wp-content/uploads/2020/12/geert-van-der-cruijsen.png"
          },
          {
            "name": "Sander Aernouts",
            "imgUrl": "/wp-content/uploads/2020/12/sander-aernouts-1.jpg"
          },
          {
            "name": "Jasper Gilhuis",
            "imgUrl": "/wp-content/uploads/2020/12/jasper-gilhuis.jpg"
          },
          {
            "name": "Mark Foppen",
            "imgUrl": "/wp-content/uploads/2021/11/DSC02111-Edit-600x600.png"
          },
          {
            "name": "Duncan Roosma",
            "imgUrl": "/wp-content/uploads/2020/12/duncan-roosma.png"
          },
          {
            "name": "Matthijs van der Veer",
            "imgUrl": "/wp-content/uploads/2021/11/matthijs-van-der-veer.png"
          },
          {
            "name": "Max Verhorst",
            "imgUrl": "/wp-content/uploads/2020/12/max-verhorst.png"
          },
          {
            "name": "Yuliya Khadasevich",
            "imgUrl": "/wp-content/uploads/2023/04/IMG_4305-400x600.jpg"
          },
          {
            "name": "Jesse Houwing",
            "imgUrl": "/wp-content/uploads/2020/12/jesse-houwing-xpirit.jpg"
          },
          {
            "name": "Natascha Former",
            "imgUrl": "/wp-content/uploads/2020/12/natascha-former.png"
          },
          {
            "name": "Rutger Buiteman",
            "imgUrl": "/wp-content/uploads/2022/03/rutger-buiteman.png"
          },
          {
            "name": "Tiamo Idzenga",
            "imgUrl": "/wp-content/uploads/2023/05/AU1A1611-Tiamo-Cropped-600x600.jpg"
          },
          {
            "name": "Loek Duys",
            "imgUrl": "/wp-content/uploads/2020/12/loek-duys.png"
          },
          {
            "name": "Anne Meijer",
            "imgUrl": "/wp-content/uploads/2020/12/anne-meijer-xpirit.png"
          },
          {
            "name": "Michiel van Oudheusden",
            "imgUrl": "/wp-content/uploads/2020/12/michiel-van-oudheusden.png"
          },
          {
            "name": "Sofie Wisse",
            "imgUrl": "/wp-content/uploads/2020/12/sofie-wisse.png"
          },
          {
            "name": "Marcel de Vries",
            "imgUrl": "/wp-content/uploads/2022/07/046A0051-Marcel-R-ex-fx-6in-600x600.jpg"
          },
          {
            "name": "Davy Davidse",
            "imgUrl": "/wp-content/uploads/2021/11/davy-davidse.png"
          },
          {
            "name": "Manuel Riezebosch",
            "imgUrl": "/wp-content/uploads/2020/12/manuel-riezebosch-xpirit.jpg"
          },
          {
            "name": "Niels Nijveldt",
            "imgUrl": "/wp-content/uploads/2020/12/niels-nijveldt.png"
          },
          {
            "name": "Erik Oppedijk",
            "imgUrl": "/wp-content/uploads/2020/12/erik-oppedijk-1-1.jpg"
          },
          {
            "name": "Immanuel Kranendonk",
            "imgUrl": "/wp-content/uploads/2020/12/immanuel-kranendonk.jpg"
          },
          {
            "name": "Sander Trijssenaar",
            "imgUrl": "/wp-content/uploads/2021/12/sander-trijssenaar-1.png"
          },
          {
            "name": "Erick Segaar",
            "imgUrl": "/wp-content/uploads/2020/12/erick-segaar.png"
          },
          {
            "name": "Alex Thissen",
            "imgUrl": "/wp-content/uploads/2020/12/alex-thissen-1.jpg"
          },
          {
            "name": "Rob Bos",
            "imgUrl": "/wp-content/uploads/2020/12/rob-bos.png"
          },
          {
            "name": "Arjan van Bekkum",
            "imgUrl": "/wp-content/uploads/2020/12/arjan-van-bekkum.png"
          },
          {
            "name": "Chris van Sluijsveld",
            "imgUrl": "/wp-content/uploads/2020/12/chris-van-sluijsveld.png"
          },
          {
            "name": "Reinier van Maanen",
            "imgUrl": "/wp-content/uploads/2020/12/reinier-van-maanen.png"
          },
          {
            "name": "Thijs Limmen",
            "imgUrl": "/wp-content/uploads/2020/12/thijs-limmen.png"
          },
          {
            "name": "Hindrik Bruinsma",
            "imgUrl": "/wp-content/uploads/2020/12/hindrik-bruinsma.png"
          },
          {
            "name": "Tijmen van de Kamp",
            "imgUrl": "/wp-content/uploads/2021/11/tijmen-van-de-kamp.jpg"
          },
          {
            "name": "Victor de Baare",
            "imgUrl": "/wp-content/uploads/2022/11/20220608-143218-JTI-401x600.jpg"
          },
          {
            "name": "Bas van de Sande",
            "imgUrl": "/wp-content/uploads/2021/04/Bas-van-de-Sande-600x600.png"
          },
          {
            "name": "Patrick van Kleef",
            "imgUrl": "/wp-content/uploads/2022/03/patrick-van-kleef-1.jpg"
          },
          {
            "name": "Kees Verhaar",
            "imgUrl": "/wp-content/uploads/2020/11/kees-verhaar.jpg"
          },
          {
            "name": "André Geuze",
            "imgUrl": "/wp-content/uploads/2022/02/andre-geuze.png"
          },
          {
            "name": "Frederik (Fred) Beeremans",
            "imgUrl": "/wp-content/uploads/2023/02/FrederikBeeremans-398x600.png"
          },
          {
            "name": "René van Osnabrugge",
            "imgUrl": "/wp-content/uploads/2020/11/rene-van-osnabrugge.png"
          },
          {
            "name": "Miranda ten Hoope",
            "imgUrl": "/wp-content/uploads/2023/06/Profielfoto-Miranda-544x600.jpg"
          },
          {
            "name": "Liuba Gonta",
            "imgUrl": "/wp-content/uploads/2022/04/liuba-gonta.png"
          },
          {
            "name": "Xander Buffart",
            "imgUrl": "/wp-content/uploads/2023/04/XanderB-450x600.jpg"
          },
          {
            "name": "Pieter-Paul Luijten",
            "imgUrl": "/wp-content/uploads/2023/04/Profile-Xebia-450x600.jpg"
          },
          {
            "name": "Hans Bakker",
            "imgUrl": "/wp-content/uploads/2022/02/Hans-Bakker-2-600x600.jpg"
          },
          {
            "name": "Sven Ansem",
            "imgUrl": "/wp-content/uploads/2023/01/20230111-170021-JTI-450x600.jpg"
          },
          {
            "name": "Jeroen van de Kraats",
            "imgUrl": "/wp-content/uploads/2022/12/20230111-163843-JTI-450x600.jpg"
          },
          {
            "name": "Jesse Swart",
            "imgUrl": "/wp-content/uploads/2021/08/jesse-swart.png"
          },
          {
            "name": "Michael van Rooijen",
            "imgUrl": "/wp-content/uploads/2023/04/20230403-170211-JTI-450x600.jpg"
          },
          {
            "name": "Erwin Staal",
            "imgUrl": "/wp-content/uploads/2021/08/erwin.png"
          },
          {
            "name": "Peter Szekeli",
            "imgUrl": "/wp-content/uploads/2023/04/20230403-155621-JTI-450x600.jpg"
          },
          {
            "name": "Danny van der Kraan",
            "imgUrl": "/wp-content/uploads/2023/04/20230403-161933-JTI-450x600.jpg"
          },
          {
            "name": "Camiel Eggermont",
            "imgUrl": "/wp-content/uploads/2023/04/20230403-165639-JTI-450x600.jpg"
          },
          {
            "name": "Dennis Thie",
            "imgUrl": "/wp-content/uploads/2021/05/dennis-thie.png"
          },
          {
            "name": "Mark de Haas",
            "imgUrl": "/wp-content/uploads/2022/08/mark-de-haas.png"
          },
          {
            "name": "Jesse Wellenberg",
            "imgUrl": "/wp-content/uploads/2022/10/AU1A1463-Jesse-W-600x600.jpg"
          },
          {
            "name": "Rik Groenewoud",
            "imgUrl": "/wp-content/uploads/2022/04/rik-groenewoud.png"
          },
          {
            "name": "Vivian Andringa",
            "imgUrl": "/wp-content/uploads/2023/04/Vivian-w-web4-600x600.jpg"
          },
          {
            "name": "Pieter Gheysens",
            "imgUrl": "/wp-content/uploads/2020/12/pieter-gheysens.png"
          },
          {
            "name": "Gill Cleeren",
            "imgUrl": "/wp-content/uploads/2020/12/gill-cleeren.png"
          },
          {
            "name": "Annemie Vandenberghe",
            "imgUrl": "/wp-content/uploads/2021/03/annemie-vandenberghe.jpg"
          },
          {
            "name": "Annelies Wauters",
            "imgUrl": "/wp-content/uploads/2022/07/annelies-wauters.png"
          },
          {
            "name": "Wesley Cabus",
            "imgUrl": "/wp-content/uploads/2021/02/wesley-cabus.png"
          },
          {
            "name": "Pieter Nijs",
            "imgUrl": "/wp-content/uploads/2020/12/pieter-nijs.png"
          },
          {
            "name": "Kristof Riebbels",
            "imgUrl": "/wp-content/uploads/2022/03/kristof-riebbels-1.jpg"
          },
          {
            "name": "Koen Luyten",
            "imgUrl": "/wp-content/uploads/2022/10/AU1A1651-Koen-600x600.jpg"
          },
          {
            "name": "Kristof van Hees",
            "imgUrl": "/wp-content/uploads/2021/01/kristof-van-hees.png"
          },
          {
            "name": "Jasper Van Mensel",
            "imgUrl": "/wp-content/uploads/2021/09/jasper-van-mensel.png"
          },
          {
            "name": "Laurenz Ovaere",
            "imgUrl": "/wp-content/uploads/2021/09/laurens-ovaere.png"
          },
          {
            "name": "Stieve Verheyden",
            "imgUrl": "/wp-content/uploads/2022/12/Profile-Stieve-Verheyden.png"
          },
          {
            "name": "Wouter Van der Auwera",
            "imgUrl": "/wp-content/uploads/2022/01/wouter-van-den-auwera-600x600.png"
          },
          {
            "name": "Bruno Van Thournout",
            "imgUrl": "/wp-content/uploads/2023/01/ID010027_Bruno-Vanthourenhout-400x600.jpg"
          },
          {
            "name": "Sujith Quintelier",
            "imgUrl": "/wp-content/uploads/2023/06/Me-600x422.jpg"
          },
          {
            "name": "Hristina Dukoska",
            "imgUrl": "/wp-content/uploads/2023/08/IMG-20230903-WA0005-450x600.jpg"
          },
          {
            "name": "Sam Van Cutsem",
            "imgUrl": "/wp-content/uploads/2023/02/Raw-Photo-400x600.jpg"
          },
          {
            "name": "Lesly Bernaola",
            "imgUrl": "/wp-content/uploads/2020/12/lesly-bernaola-xpirit.jpg"
          },
          {
            "name": "Sorin Pasa",
            "imgUrl": "/wp-content/uploads/2020/12/sorin-pasa-xpirit.jpg"
          },
          {
            "name": "Michael Kaufmann",
            "imgUrl": "/wp-content/uploads/2021/06/Square_nologo-600x600.jpg"
          },
          {
            "name": "Thomas Tomow",
            "imgUrl": "/wp-content/uploads/2021/06/Gros-IMG_20200317_163210_sqare2.jpg"
          },
          {
            "name": "Tobias Mackenroth",
            "imgUrl": "/wp-content/uploads/2022/10/AU1A1065-Tobias-Edit-Edit-2.jpg"
          },
          {
            "name": "Marko Sawall",
            "imgUrl": "/wp-content/uploads/2023/07/Image-from-iOS-600x600.jpg"
          },
          {
            "name": "Miriam Hunger",
            "imgUrl": "/wp-content/uploads/2023/09/mhunger_bg_wall.png"
          },
          {
            "name": "Andreas Giesa",
            "imgUrl": "/wp-content/uploads/2023/09/MicrosoftTeams-image-2-450x600.jpg"
          },
          {
            "name": "Marius Boden",
            "imgUrl": "/wp-content/uploads/2023/07/Xpirit-500x600.jpg"
          },
          {
            "name": "Philip Wagner",
            "imgUrl": "/wp-content/uploads/2023/07/IMG_0684-600x592.jpg"
          },
          {
            "name": "Yuriy Varshavskyy",
            "imgUrl": "/wp-content/uploads/2023/08/Bild1-428x600.jpg"
          },
          {
            "name": "Thomas Richter",
            "imgUrl": "/wp-content/uploads/2023/08/cut-515x600.jpg"
          },
          {
            "name": "Sebstian Böder",
            "imgUrl": "/wp-content/uploads/2023/08/Screenshot-2023-08-10-132535-600x600.png"
          },
          {
            "name": "Olena Borzenko",
            "imgUrl": "/wp-content/uploads/2022/01/olena_borzenko-e1642482722909-590x600.jpg"
          },
          {
            "name": "Andreas Läubli",
            "imgUrl": "/wp-content/uploads/2021/06/ich-1-589x600.jpg"
          },
          {
            "name": "Gema Morilla Guirado",
            "imgUrl": "/wp-content/uploads/2022/08/Gema_Morilla_profile-e1666196869976-467x600.jpg"
          },
          {
            "name": "Andriy Chevychalov",
            "imgUrl": "/wp-content/uploads/2022/10/AU1A1248-Andriy-Edit-2.jpg"
          },
          {
            "name": "Michael Contento",
            "imgUrl": "/wp-content/uploads/2022/09/profil_20231-600x578.jpg"
          },
          {
            "name": "Private: Robin Konrad (exited)",
            "imgUrl": "/wp-content/uploads/2022/09/RobinKonrad-578x600.png"
          },
          {
            "name": "Till Spindler",
            "imgUrl": "/wp-content/uploads/2022/09/Till-e1667386506995.jpeg"
          },
          {
            "name": "Stefan Rapp",
            "imgUrl": "/wp-content/uploads/2023/01/StefanRapp_800x1199-400x600.jpg"
          },
          {
            "name": "Artur Kordowski",
            "imgUrl": "/wp-content/uploads/2022/09/akordowski-508x600.jpg"
          },
          {
            "name": "Nico Orschel",
            "imgUrl": "/wp-content/uploads/2022/09/norschel-600x600.jpeg"
          },
          {
            "name": "Harald Binkle",
            "imgUrl": "/wp-content/uploads/2023/08/Harald_Binkle_Portait-442x600.png"
          },
          {
            "name": "Maik Müller",
            "imgUrl": "/wp-content/uploads/2021/12/aatmmr_one_bw-450x600.png"
          },
          {
            "name": "Esteban Garcia",
            "imgUrl": "/wp-content/uploads/2022/05/Esteban-1of3-Esteban-Xpirit-Headshot-R-ex-cr-6in-600x600.jpg"
          },
          {
            "name": "Robert Bremer",
            "imgUrl": "/wp-content/uploads/2022/05/046A0038-Rob-Xpirit-Headshot-R-ex-cr-6in-b-600x600.jpg"
          },
          {
            "name": "Natalie Reinford",
            "imgUrl": "/wp-content/uploads/2022/08/natalie-reinford.png"
          },
          {
            "name": "Rockford Lhotka",
            "imgUrl": "/wp-content/uploads/2022/10/Rockford_Lhotka-removebg-preview.png"
          },
          {
            "name": "Stuart Celarier",
            "imgUrl": "/wp-content/uploads/2022/09/stuart-removebg-preview.png"
          },
          {
            "name": "David Sanchez",
            "imgUrl": "/wp-content/uploads/2022/10/DavidPhoto-600x600.jpg"
          },
          {
            "name": "Mario Mamalis",
            "imgUrl": "/wp-content/uploads/2022/11/Mario-Headshot.png"
          },
          {
            "name": "Troy Micka",
            "imgUrl": "/wp-content/uploads/2022/11/Troy-Headshot.png"
          },
          {
            "name": "Charlton Trezevant",
            "imgUrl": "/wp-content/uploads/2023/01/046A7174-Charleton-Xpirit-R2-cr-ex-6in-600x600.jpg"
          },
          {
            "name": "Randy Jerome",
            "imgUrl": "/wp-content/uploads/2023/02/Randy-Jerome-600x589.jpg"
          },
          {
            "name": "Trish Roberts",
            "imgUrl": "/wp-content/uploads/2023/01/Trish-Headshot-600x600.jpg"
          },
          {
            "name": "Thiago Custodio",
            "imgUrl": "/wp-content/uploads/2023/01/tcustodio-450x600.jpg"
          },
          {
            "name": "Heidi Araya",
            "imgUrl": "/wp-content/uploads/2023/02/Heidi-Araya-512x600.png"
          },
          {
            "name": "Karina Moscoso",
            "imgUrl": "/wp-content/uploads/2023/03/Untitled-design-1-600x600.png"
          },
          {
            "name": "Kimberly Martin",
            "imgUrl": "/wp-content/uploads/2023/02/046A7108-Kim-Xpirit-R-ex-6in-600x600.jpg"
          },
          {
            "name": "Sarah Michaud",
            "imgUrl": "/wp-content/uploads/2023/03/Untitled-design-595x600.png"
          },
          {
            "name": "Josh Garverick",
            "imgUrl": "/wp-content/uploads/2023/03/Untitled-design-2-600x600.png"
          },
          {
            "name": "Matt Olson",
            "imgUrl": "/wp-content/uploads/2023/03/046A0241-Matt-Olson-R-cr-6in-600x600.jpg"
          },
          {
            "name": "Climon Galunza",
            "imgUrl": "/wp-content/uploads/2023/04/Untitled-design-5-600x600.png"
          },
          {
            "name": "Bryan Knox",
            "imgUrl": "/wp-content/uploads/2023/04/Bryan-479x600.png"
          },
          {
            "name": "Brooke Vorhees",
            "imgUrl": "/wp-content/uploads/2023/04/Untitled-design-7-600x600.png"
          },
          {
            "name": "Victoria Harding",
            "imgUrl": "/wp-content/uploads/2023/04/Untitled-design-8-600x600.png"
          },
          {
            "name": "Randy Pagels",
            "imgUrl": "/wp-content/uploads/2023/05/Untitled-design-9-1-600x600.png"
          },
          {
            "name": "Cory Cordell",
            "imgUrl": "/wp-content/uploads/2023/06/Untitled-design-10-600x600.png"
          },
          {
            "name": "Carlos Chico",
            "imgUrl": "/wp-content/uploads/2023/06/Untitled-design-13-600x600.png"
          },
          {
            "name": "Allen Conway",
            "imgUrl": "/wp-content/uploads/2023/06/Untitled-design-21-600x600.png"
          },
          {
            "name": "Jeff Davis",
            "imgUrl": "/wp-content/uploads/2023/06/Untitled-design-12-600x600.png"
          },
          {
            "name": "Joshua Goldsmith",
            "imgUrl": "/wp-content/uploads/2023/06/Joshua-600x521.png"
          },
          {
            "name": "JT Jarnegan",
            "imgUrl": "/wp-content/uploads/2023/06/Untitled-design-15-600x600.png"
          },
          {
            "name": "Bailey Fitchett",
            "imgUrl": "/wp-content/uploads/2023/07/Untitled-design-17-600x600.png"
          },
          {
            "name": "Michelle Welcks",
            "imgUrl": "/wp-content/uploads/2023/07/Untitled-design-18-600x600.png"
          },
          {
            "name": "Robert Wafle",
            "imgUrl": "/wp-content/uploads/2023/07/Untitled-design-19-600x600.png"
          },
          {
            "name": "Evan Allen",
            "imgUrl": "/wp-content/uploads/2023/08/Untitled-design-20-600x600.png"
          },
          {
            "name": "Chad Cross",
            "imgUrl": "/wp-content/uploads/2023/08/Untitled-design-24-600x600.png"
          },
          {
            "name": "Martha Garron",
            "imgUrl": "/wp-content/uploads/2023/08/Untitled-design-23-600x600.png"
          },
          {
            "name": "Blaize Stewart",
            "imgUrl": "/wp-content/uploads/2023/09/Untitled-design-25-600x600.png"
          }
        ]
    };
  },
  methods: {
    randomizeList() {
      const maxItems = Math.min(this.originalList.length, 10);
      const shuffledList = this.originalList.slice().sort(() => Math.random() - 0.5);
      this.myList = shuffledList.slice(0, maxItems).map(item => ({
        ...item, // Copy the original item's properties.
        answer: '', // Add an 'answer' field initialized as an empty string.
        firstName: item.name.split(' ')[0], // Add a 'firstName' field initialized with the first part of the item's name (before the first space
        link: "https://xpirit.com" + item.imgUrl, // Add a 'link' field initialized with the item's imgUrl.
      }));
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
