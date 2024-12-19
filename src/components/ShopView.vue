<template>
  <div class="shop-container">
    <RestaurantHeader
      :cartItems="cartItems"
      :totalPrice="totalPrice"
      @goToCheckout="showCheckout = true"
    />

    <!-- Hero Section with Video Background -->
    <section class="hero">
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

      <!-- Content over the Video -->
      <div class="hero-content">
        <h1>Herzlich willkommen, {{ customerName }}!</h1>
        <!-- In deinem Template: -->
        <nav class="category-sidebar">
          <ul>
            <li>
              <a href="#Vorspeise" @click="scrollToCategory('Vorspeise')"
                >Vorspeisen</a
              >
            </li>
            <li>
              <a href="#Hauptgericht" @click="scrollToCategory('Hauptgericht')"
                >Hauptspeise</a
              >
            </li>
            <li>
              <a href="#Dessert" @click="scrollToCategory('Dessert')"
                >Dessert</a
              >
            </li>
            <li>
              <a href="#Getränk" @click="scrollToCategory('Getränk')"
                >Getränk</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </section>

    <div class="shop-content">
      <div class="menu-items">
        <section
          v-for="category in [
            'Vorspeise',
            'Hauptgericht',
            'Dessert',
            'Getränk',
          ]"
          :key="category"
          :id="category"
        >
          <h2>{{ category }}</h2>
          <div
            class="item"
            v-for="item in filteredItems(category)"
            :key="item.id"
          >
            <!-- Medien (Bilder/Videos) -->
            <div v-if="getMediaPath(item.id)">
              <img
                v-if="isImage(getMediaPath(item.id))"
                :src="getMediaPath(item.id)"
                alt="Menu item"
                class="menu-item-image"
                @error="handleImageError"
              />
              <video
                v-else-if="isVideo(getMediaPath(item.id))"
                :src="getMediaPath(item.id)"
                controls
                autoplay
                loop
                muted
                class="menu-item-video"
              ></video>
            </div>

            <!-- Menüdetails -->
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p>{{ item.price }} €</p>
            <button @click="addToCart(item)">In den Warenkorb</button>
          </div>
        </section>

        <selection class="review-selection">
          <ReviewSlider />
        </selection>

        <FooterMain />
      </div>

      <!-- Checkout-Komponente -->
      <CheckoutView
        v-if="showCheckout"
        :cartItems="cartItems"
        :totalPrice="totalPrice"
        :customerGuid="customerGuid"
        :customerName="customerName"
        @orderCompleted="handleOrderCompletion"
        @continueShopping="handleContinueShopping"
      />
    </div>
  </div>
</template>

<script>
import RestaurantHeader from "./RestaurantHeader.vue";
import CheckoutView from "./CheckoutView.vue";
import axios from "axios";
import FooterMain from "./FooterMain.vue";
import Weinvideo from "../assets/Wein.mp4";

export default {
  name: "ShopView",
  components: {
    RestaurantHeader,
    FooterMain,

    CheckoutView,
  },
  data() {
    return {
      customerGuid: "",
      customerName: "",
      menuItems: [], // Menü aus der Datenbank
      cartItems: [],
      totalPrice: 0,
      showCheckout: false,
      mediaMapping: {
        1: "Bruschetta1.jpg", // Bruschetta
        2: "CesarSalad.jpeg", // Caesar Salad
        3: "SpaghettiCarbonara.mp4", // Spaghetti Carbonara
        4: "BeefSteak.mp4", // Rindersteak
        5: "Tiramisu.jpg", // Tiramisu
        6: "Espresso.mp4", // Espresso
      },
      videos: [Weinvideo], // Liste der Videos
      currentVideo: Weinvideo, // Standardmäßig Pizza-Video
      isPastaVideo: false, // Flag, um zu erkennen, ob Pasta-Video aktiv ist
      videoInterval: null, // Speichert den Intervall-Timer
    };
  },
  mounted() {
    this.fetchCustomerInfo();
    this.fetchMenuItems();
  },
  methods: {
    async fetchCustomerInfo() {
      const reservationCode = this.$route.params.reservation_code; // Verwende reservation_code
      this.customerGuid = reservationCode;

      try {
        const response = await axios.get(
          `http://localhost/reservation-api/reservation/get_customer_name.php?reservation_code=${reservationCode}`
        );
        if (response.data.status === "success") {
          this.customerName = `${response.data.firstname} ${response.data.lastname}`;
        } else {
          this.$router.push("/error-page");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Kundendaten:", error);
        this.$router.push("/error-page");
      }
    },
    scrollToCategory(category) {
      // Finde das Element mit der entsprechenden ID und scrolle es leicht nach oben
      const categoryElement = document.getElementById(category);

      if (categoryElement) {
        // Scrollt zum Ziel und nimmt etwas Abstand, um den Header zu berücksichtigen
        window.scrollTo({
          top: categoryElement.offsetTop - 50, // 80px Abstand für den Header
          behavior: "smooth", // Sanftes Scrollen
        });
      }
    },
    async fetchMenuItems() {
      try {
        const response = await axios.get(
          "http://localhost/reservation-api/order/get_menu_items.php"
        );
        if (response.data.status === "success") {
          this.menuItems = response.data.items;
        } else {
          console.error(
            "Fehler beim Laden der Speisen:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Fehler beim Laden der Speisen:", error);
      }
    },

    filteredItems(category) {
      return this.menuItems.filter((item) => item.category === category);
    },

    addToCart(item) {
      this.cartItems.push(item);
      this.totalPrice += parseFloat(item.price);
    },

    handleOrderCompletion() {
      this.cartItems = [];
      this.totalPrice = 0;
      this.showCheckout = false;
    },

    handleContinueShopping() {
      this.showCheckout = false;
    },

    handleImageError(event) {
      event.target.src = "/assets/logo.png"; // Fallback-Bild
    },

    getMediaPath(itemId) {
      const filename = this.mediaMapping[itemId];
      return filename ? require(`@/assets/${filename}`) : null;
    },

    isImage(filename) {
      return /\.(jpg|jpeg|png|gif)$/i.test(filename);
    },

    isVideo(filename) {
      return /\.(mp4|webm|ogg)$/i.test(filename);
    },
  },
};
</script>

<style scoped>
/* Styling */
.shop-container {
  background-color: black;
  color: white;
}

.hero {
  position: relative;
  height: 100vh; /* Volle Bildschirmhöhe */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1; /* Inhalt wird vor dem Video angezeigt */
  color: white; /* Textfarbe */
  font-size: 2.5rem; /* Größere Schrift für den Titel */
  font-weight: bold; /* Fettgedruckter Text */
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7); /* Schattierung für besseren Kontrast */
  padding: 0 20px; /* Etwas Abstand links und rechts */
}

.hero-content h1 {
  font-size: 3rem; /* Größerer Titel */
  margin-bottom: 20px; /* Abstand unter dem Titel */
  font-family: "Arial", sans-serif; /* Schöne Schriftart */
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Das Video wird skaliert, um den gesamten Hintergrund auszufüllen */
  z-index: 0; /* Video wird hinter dem Inhalt platziert */
}

.category-sidebar {
  margin-top: 30px;
  color: white;
  font-size: 1.4rem; /* Größere Schriftgröße */
  padding: 20px; /* Mehr Abstand innerhalb der Sidebar */
  background: rgba(0, 0, 0, 0.5); /* Halbtransparenter Hintergrund */
  border-radius: 8px; /* Abgerundete Ecken */
}

.category-sidebar ul {
  list-style: none;
  padding: 0;
}

.category-sidebar li {
  margin-bottom: 20px; /* Mehr Abstand zwischen den Menüpunkten */
}

.category-sidebar a {
  color: gold;
  font-size: 1.6rem; /* Noch größere Schriftgröße */
  display: block; /* Jedes Element auf einer neuen Zeile */
  padding: 10px 20px; /* Größerer Abstand für die Links */
  border-radius: 5px; /* Abgerundete Ecken */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.category-sidebar a:hover {
  color: black;
  background-color: #e3b23c;
}

.menu-items {
  flex-grow: 1;
  padding: 20px;
}

.menu-items section {
  margin-bottom: 40px;
}

.menu-items .item {
  background-color: transparent;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.menu-items .item:hover {
  background-color: #e3b23c;
  color: black;
}

.menu-item-image,
.menu-item-video {
  width: 80%; /* Bilder und Videos auf 80% der Breite setzen */
  max-width: 300px; /* Maximale Breite festlegen */
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
  display: block; /* Stellen sicher, dass sie als Block-Element angezeigt werden */
  margin-left: auto; /* Zentrieren */
  margin-right: auto; /* Zentrieren */
}

button {
  padding: 10px 20px;
  background-color: #e3b23c;
  color: black;
  border: black;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #b17d23;
  color: white;
  border: black;
  border-radius: 30px;
}

@media (max-width: 768px) {
  .shop-container {
    display: block;
  }

  .hero-content h1 {
    font-size: 2.5rem; /* Kleinere Schriftgröße auf mobilen Geräten */
  }

  .category-sidebar {
    width: 100%;
    padding: 15px;
    font-size: 1.2rem;
  }

  .menu-items {
    padding: 10px;
  }
}
</style>
