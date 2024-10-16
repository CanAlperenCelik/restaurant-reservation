<template>
  <div class="shop-container">
    <h1>Herzlich willkommen, {{ customerName }}!</h1>
    <RestaurantHeader
      :cartItems="cartItems"
      :totalPrice="totalPrice"
      @goToCheckout="showCheckout = true"
    />
    <div class="shop-content">
      <nav class="category-sidebar">
        <ul>
          <li><a href="#antipasti">Vorspeisen</a></li>
          <li><a href="#pizza">Pizza</a></li>
          <li><a href="#pasta">Pasta</a></li>
          <li><a href="#dessert">Nachspeisen</a></li>
          <li><a href="#drinks">Getränke</a></li>
        </ul>
      </nav>

      <div class="menu-items">
        <section id="antipasti">
          <h2>Vorspeisen</h2>
          <div
            class="item"
            v-for="item in filteredItems('Vorspeise')"
            :key="item.id"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p>{{ item.price }} €</p>
            <button @click="addToCart(item)">In den Warenkorb</button>
          </div>
        </section>

        <section id="pizza">
          <h2>Pizza</h2>
          <div
            class="item"
            v-for="item in filteredItems('Pizza')"
            :key="item.id"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p>{{ item.price }} €</p>
            <button @click="addToCart(item)">In den Warenkorb</button>
          </div>
        </section>

        <section id="pasta">
          <h2>Pasta</h2>
          <div
            class="item"
            v-for="item in filteredItems('Pasta')"
            :key="item.id"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p>{{ item.price }} €</p>
            <button @click="addToCart(item)">In den Warenkorb</button>
          </div>
        </section>

        <section id="dessert">
          <h2>Nachspeisen</h2>
          <div
            class="item"
            v-for="item in filteredItems('Nachspeise')"
            :key="item.id"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p>{{ item.price }} €</p>
            <button @click="addToCart(item)">In den Warenkorb</button>
          </div>
        </section>

        <section id="drinks">
          <h2>Getränke</h2>
          <div
            class="item"
            v-for="item in filteredItems('Getränk')"
            :key="item.id"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p>{{ item.price }} €</p>
            <button @click="addToCart(item)">In den Warenkorb</button>
          </div>
        </section>
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

export default {
  name: "ShopView",
  components: {
    RestaurantHeader,
    CheckoutView,
  },
  data() {
    return {
      customerGuid: "", // GUID des Kunden
      customerName: "", // Fügen Sie eine Variable für den Kundennamen hinzu
      menuItems: [],
      cartItems: [],
      totalPrice: 0,
      showCheckout: false,
      guidIsValid: false, // Neue Variable, um zu speichern, ob die GUID gültig ist
      loading: true,
    };
  },
  mounted() {
    this.checkGuidValidity(); // GUID überprüfen
    this.fetchCustomerName(); // Kundennamen laden
    this.fetchMenuItems(); // Speisen aus der Datenbank laden
  },
  methods: {
    async checkGuidValidity() {
      const guid = this.$route.params.guid; // GUID aus der URL abrufen
      this.customerGuid = guid; // Setze die GUID im Datenobjekt
      try {
        const response = await axios.get(
          `http://localhost/reservation-api/check_guid.php?guid=${guid}`
        );
        if (response.data.status === "success") {
          this.guidIsValid = true; // GUID ist gültig
          this.fetchCustomerName(); // Kundennamen laden
        } else {
          this.guidIsValid = false; // GUID ist ungültig
          this.$router.push("/error-page"); // Fehlerseite anzeigen, wenn die GUID ungültig ist
        }
      } catch (error) {
        console.error("Fehler beim Überprüfen der GUID:", error);
        this.$router.push("/error-page");
      } finally {
        this.loading = false;
      }
    },
    async fetchCustomerName() {
      if (!this.guidIsValid) return; // Stelle sicher, dass die GUID gültig ist
      const guid = this.customerGuid; // Verwende die gesetzte GUID
      try {
        const response = await axios.get(
          `http://localhost/reservation-api/get_customer_name.php?guid=${guid}` // GUID an API senden
        );
        if (response.data.status === "success") {
          this.customerName = response.data.name; // Kundennamen speichern
        } else {
          console.error(
            "Fehler beim Laden des Kundennamens:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Fehler beim Laden des Kundennamens:", error);
      }
    },
    async fetchMenuItems() {
      try {
        const response = await axios.get(
          "http://localhost/reservation-api/get_menu_items.php"
        );
        if (response.data.status === "success") {
          this.menuItems = response.data.items; // Speichern der geladenen Speisen
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
      this.totalPrice += parseFloat(item.price); // totalPrice als Zahl aktualisieren
    },
    handleOrderCompletion() {
      // Warenkorb leeren und zurück zur Hauptseite
      this.cartItems = [];
      this.totalPrice = 0;
      this.showCheckout = false;
    },
    handleContinueShopping() {
      this.showCheckout = false; // Checkout-Fenster schließen
    },
    async placeOrder() {
      const orderData = {
        guid: this.customerGuid,
        name: this.customerName,
        orderDetails: this.cartItems.map((item) => item.id), // Hier nur die Gerichts-IDs übergeben
        totalPrice: this.totalPrice,
      };

      try {
        const response = await axios.post(
          "http://localhost/reservation-api/save_order.php",
          orderData
        );
        if (response.data.status === "success") {
          this.handleOrderCompletion(); // Bestellung erfolgreich, Warenkorb leeren
        } else {
          console.error(
            "Fehler beim Speichern der Bestellung:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Fehler beim Speichern der Bestellung:", error);
      }
    },
  },
};
</script>

<style scoped>
.shop-container {
  display: flex;
}

.category-sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
}

.category-sidebar ul {
  list-style-type: none;
  padding: 0;
}

.category-sidebar li {
  margin-bottom: 10px;
}

.category-sidebar a {
  text-decoration: none;
  color: #333;
}

.menu-items {
  flex-grow: 1;
  padding: 20px;
}

.menu-items section {
  margin-bottom: 50px;
}

.menu-items .item {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #c0392b;
}
</style>
