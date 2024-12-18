<template>
  <div class="page-container">
    <LoginHeader />
    <!-- Hero-Bereich mit Video -->
    <section class="hero" ref="heroSection">
      <!-- Video-Hintergrund -->
      <video
        autoplay
        muted
        loop
        playsinline
        class="background-video"
        :class="{ 'zoom-pasta': isPastaVideo }"
        ref="backgroundVideo"
      >
        <source :src="currentVideo" type="video/mp4" />
        Dein Browser unterstützt keine Videos.
      </video>

      <!-- Inhalte im Hero-Bereich -->
      <div class="hero-content">
        <h1>Da Lisa Pizzeria Heilbronn</h1>
        <h2>Feinste italienische Küche</h2>
        <button @click="scrollToInfoSection">Mehr erfahren</button>
      </div>
    </section>

    <!-- Info-Sektion mit Bildern -->
    <section class="info-section" ref="infoSection">
      <div class="info-container">
        <!-- Textbereich -->
        <div class="text-section">
          <h3>delizioso</h3>
          <h2>Die leckersten Pizzen & Pasta</h2>
          <p>
            Willkommen bei Da Lisa, dem Place-to-be für die besten Pizzen und
            Pasta in Heilbronn! Wir sind ein echter Familienbetrieb mit
            Leidenschaft für authentisch italienische Küche.
          </p>
          <p>
            Hier bei uns erwartet dich nicht nur ein kulinarisches Erlebnis,
            sondern auch ein herzliches Team, das mit frischen Zutaten und viel
            Liebe zum Detail arbeitet. Von unseren köstlichen Pizzen bis hin zu
            al dente gekochter Pasta – bei uns ist für jeden etwas dabei.
          </p>
          <p>
            Komm vorbei und genieße unsere traditionellen Gerichte oder probiere
            unsere wöchentlich wechselnden Specials. Bei Da Lisa wird Essen zu
            einem Erlebnis! Buon appetito!
          </p>
          <div class="button-container">
            <button @click="goToMenuCard">Zur Speisekarte</button>
            <button @click="goToReservation">Jetzt Reservieren!</button>
          </div>
        </div>

        <!-- Bildbereich -->
        <div class="image-section">
          <img
            src="@/assets/pizzaPic.jpg"
            alt="Pizza-Bild"
            class="pizza-image"
          />
          <img
            src="@/assets/familyPic.jpg"
            alt="Familienfoto"
            class="family-image"
          />
        </div>
      </div>
    </section>
    <selection class="review-selection">
      <ReviewSlider />
    </selection>
    <FooterMain />
  </div>
</template>

<script>
import LoginHeader from "./LoginHeader.vue";
import pizzaVideo from "../assets/Pizza.mp4";
import pastaVideo from "../assets/Pasta.mp4";
import FooterMain from "./FooterMain.vue";
import ReviewSlider from "./ReviewSlider.vue";
export default {
  name: "HomePage",
  components: {
    LoginHeader,
    FooterMain,
    ReviewSlider,
  },
  data() {
    return {
      videos: [pizzaVideo, pastaVideo], // Liste der Videos
      currentVideo: pizzaVideo, // Standardmäßig Pizza-Video
      isPastaVideo: false, // Flag, um zu erkennen, ob Pasta-Video aktiv ist
      videoInterval: null, // Speichert den Intervall-Timer
    };
  },
  methods: {
    goToReservation() {
      this.$router.push({ name: "Reservation" });
    },
    goToMenuCard() {
      this.$router.push({ name: "MenuCard" });
    },
    scrollToInfoSection() {
      this.$refs.infoSection.scrollIntoView({ behavior: "smooth" });
    },
    startVideoRotation() {
      let index = 0;
      this.videoInterval = setInterval(() => {
        index = (index + 1) % this.videos.length; // Nächstes Video in der Liste
        this.currentVideo = this.videos[index]; // Video wechseln
        this.isPastaVideo = this.currentVideo === pastaVideo; // Flag setzen
        const videoElement = this.$refs.backgroundVideo; // Video-Element abrufen
        videoElement.load(); // Video neu laden, damit es sofort wechselt
      }, 10000); // Wechsel alle 10 Sekunden
    },
    stopVideoRotation() {
      if (this.videoInterval) {
        clearInterval(this.videoInterval); // Timer stoppen
      }
    },
  },
  mounted() {
    this.startVideoRotation(); // Video-Wechsel starten, wenn die Komponente geladen wird
  },
  beforeUnmount() {
    this.stopVideoRotation(); // Video-Wechsel stoppen, wenn die Komponente zerstört wird
  },
};
</script>

<style scoped>
/* Allgemeines Styling */
.page-container {
  background-color: black;
  color: white;
}

/* Hero-Bereich */
.hero {
  padding: 50px 20px;
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}

.hero h2 {
  font-size: 1.5rem;
  color: #e3b23c;
}

.hero button {
  margin-top: 20px;
  padding: 10px 20px;
  background: none;
  border: 1px solid #e3b23c;
  color: #e3b23c;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s ease;
}

.hero button:hover {
  background: #e3b23c;
  color: black;
}
/* Info-Sektion */
.info-section {
  margin: 45px auto;
  padding: 50px 20px;
  background: black;
  display: flex;
  justify-content: center;
}

/* Info-Container */
.info-container {
  max-width: 1200px;
  display: flex;
  flex-direction: column; /* Vertikale Anordnung: Text über Bildern */
  margin: 0 auto;
  gap: 40px;
  position: relative;
  width: 100%; /* Sicherstellen, dass der Container die gesamte Breite einnimmt */
}

/* Textbereich */
.text-section {
  text-align: center; /* Text zentrieren */
}

.text-section h3 {
  font-size: 2rem;
  color: #e3b23c;
  font-weight: bold;
  margin-bottom: 10px;
}

.text-section h2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 1.2;
}

.text-section p {
  margin-bottom: 15px;
  font-size: 1.2rem;
  line-height: 1.6;
}

/* Bildbereich */
.image-section {
  display: flex;
  justify-content: center; /* Bilder zentrieren */
  gap: 20px; /* Abstand zwischen den Bildern */
  margin-top: 20px; /* Abstand von Textbereich zu Bildern */
  flex-wrap: wrap; /* Sicherstellen, dass die Bilder bei kleinen Bildschirmen umgebrochen werden */
}

.pizza-image,
.family-image {
  width: 45%; /* Bilder nehmen 45% der Breite ein */
  max-width: 300px; /* Maximalbreite auf 300px setzen */
  height: auto; /* Höhe automatisch anpassen */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Buttons */
.button-container {
  margin: 45px auto;
  text-align: center; /* Buttons zentrieren */
}

button {
  background: none;
  border: 1px solid #e3b23c;
  color: #e3b23c;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s ease;
}

button:hover {
  background: #e3b23c;
  color: black;
}

/* Responsives Design für kleinere Bildschirmgrößen */
@media (max-width: 768px) {
  .info-container {
    flex-direction: column; /* Text und Bilder untereinander anordnen */
    align-items: center; /* Textbereich und Bilder zentrieren */
  }

  .text-section {
    text-align: center; /* Text zentrieren */
  }

  .image-section {
    justify-content: center; /* Bilder zentrieren */
  }

  .pizza-image,
  .family-image {
    width: 40%; /* Bilder auf 90% der Breite anpassen */
    max-width: 300px; /* Maximalbreite auf 300px setzen */
  }

  .button-container {
    text-align: center; /* Buttons untereinander und zentriert */
    margin-bottom: 20px; /* Abstand zwischen den Buttons und den Bildern */
  }

  button {
    width: 100%; /* Buttons nehmen 100% der Breite ein */
    margin-bottom: 10px; /* Abstand zwischen den Buttons */
  }
}

/* Anpassungen für sehr kleine Bildschirme */
@media (max-width: 480px) {
  .text-section h3 {
    font-size: 1.8rem;
  }

  .text-section h2 {
    font-size: 2rem;
  }

  .text-section p {
    font-size: 1rem;
  }
  .image-section {
    width: 100%;
    height: 80%;
  }

  .pizza-image,
  .family-image {
    width: 300px;
    height: 300px;
  }
}
</style>
