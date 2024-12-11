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
        <h1>Vielen Dank für Ihre Reservierung!</h1>
        <p>Wir freuen uns darauf, Sie bald bei uns begrüßen zu dürfen.</p>
        <button @click="goToHome">Zur Startseite</button>
      </div>
    </section>

    <FooterMain />
  </div>
</template>

<script>
import LoginHeader from "./LoginHeader.vue";
import pastaVideo from "../assets/Pasta.mp4";
import PizzaCutVideo from "../assets/PizzaCut.mp4";
import WeinVideo from "../assets/Wein.mp4";
import FooterMain from "./FooterMain.vue";

export default {
  name: "ThankYouPage",
  components: {
    LoginHeader,
    FooterMain,
  },
  data() {
    return {
      videos: [WeinVideo], // Liste der Videos
      currentVideo: PizzaCutVideo, // Standardmäßig Pizza-Video
      isPastaVideo: false, // Flag, um zu erkennen, ob Pasta-Video aktiv ist
      videoInterval: null, // Speichert den Intervall-Timer
    };
  },
  methods: {
    goToHome() {
      this.$router.push({ name: "Home" }); // Navigiert zur Startseite
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

.hero p {
  font-size: 1.5rem;
  margin-bottom: 20px;
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

/* Footer */
footer {
  text-align: center;
  padding: 20px;
  background-color: #333;
  color: #fff;
}
</style>
