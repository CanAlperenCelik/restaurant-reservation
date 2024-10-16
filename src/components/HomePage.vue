<template>
  <div class="page-container">
    <!-- AdminHeader-Komponente einfügen -->
    <AdminHeader />

    <!-- Erste Sektion mit schwarzem Hintergrund -->
    <section class="hero" ref="heroSection">
      <div class="content">
        <h2>Willkommen in unserem Italienischen Restaurant</h2>
        <p>Entdecke die besten Pizzen und Pastagerichte!</p>
        <button @click="scrollToContent">Erfahre mehr</button>
      </div>
    </section>

    <!-- Zweite Sektion mit schwarzem Hintergrund -->
    <section class="black-section" ref="blackSection">
      <div class="content">
        <h2>Reserviere jetzt einen Tisch!</h2>
        <button @click="goToReservation">Zur Reservierung</button>
        <button @click="goToMenu">Zur Speisekarte</button>
      </div>
    </section>
  </div>
</template>

<script>
import AdminHeader from "./AdminHeader.vue"; // AdminHeader korrekt importieren

export default {
  name: "HomePage",
  components: {
    AdminHeader, // AdminHeader hier registrieren
  },
  data() {
    return {
      cartItems: [],
      totalPrice: 0,
    };
  },
  methods: {
    scrollToContent() {
      this.$refs.blackSection.scrollIntoView({ behavior: "smooth" });
    },
    goToReservation() {
      this.$router.push({ name: "Reservation" });
    },
    goToMenu() {
      this.$router.push({ name: "Menu" });
    },
    handleScroll() {
      const heroHeight = this.$refs.heroSection.clientHeight;
      if (window.scrollY > heroHeight) {
        this.$refs.heroSection.classList.add("scrolled");
      } else {
        this.$refs.heroSection.classList.remove("scrolled");
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.page-container {
  height: 200vh;
  scroll-behavior: smooth;
  background-color: black;
}

/* Erste Sektion mit schwarzem Hintergrund */
.hero {
  position: relative;
  height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
}

.hero .content {
  text-align: center;
  z-index: 1;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 40px;
}

button {
  padding: 10px 20px;
  font-size: 18px;
  background-color: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #c0392b;
}

/* Zweite Sektion: Schwarzer Hintergrund */
.black-section {
  height: 100vh;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.black-section h2 {
  font-size: 2.5rem;
}

.black-section button {
  padding: 10px 20px;
  font-size: 18px;
  background-color: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
}

.black-section button:hover {
  background-color: #c0392b;
}
</style>
