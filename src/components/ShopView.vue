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
          <li><a href="#Vorspeise">Vorspeisen</a></li>
          <li><a href="#Hauptgericht">Hauptspeise</a></li>
          <li><a href="#Dessert">Dessert</a></li>
          <li><a href="#Getränk">Getränke</a></li>
        </ul>
      </nav>

      <div class="menu-items">
        <section id="Vorspeise">
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

        <section id="Hauptgericht">
          <h2>Hauptgericht</h2>
          <div
            class="item"
            v-for="item in filteredItems('Hauptgericht')"
            :key="item.id"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p>{{ item.price }} €</p>
            <button @click="addToCart(item)">In den Warenkorb</button>
          </div>
        </section>

        <section id="Dessert">
          <h2>Dessert</h2>
          <div
            class="item"
            v-for="item in filteredItems('Dessert')"
            :key="item.id"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p>{{ item.price }} €</p>
            <button @click="addToCart(item)">In den Warenkorb</button>
          </div>
        </section>

        <section id="Getränke">
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
    this.fetchCustomerInfo(); // Ruft Kundennamen und Informationen ab
    this.fetchMenuItems(); // Speisen aus der Datenbank laden
  },
  methods: {
    // Holt die GUID aus der URL und überprüft sie
    async fetchCustomerInfo() {
      const guid = this.$route.params.guid; // GUID aus der URL abrufen
      this.customerGuid = guid; // Setze die GUID im Datenobjekt

      try {
        const response = await axios.get(
          `http://localhost/reservation-api/order/check_guid.php?guid=${guid}`
        );
        if (response.data.status === "success") {
          this.guidIsValid = true;
          this.fetchCustomerName(); // Kundennamen abrufen
        } else {
          this.guidIsValid = false;
          this.$router.push("/error-page");
        }
      } catch (error) {
        console.error("Fehler beim Überprüfen der GUID:", error);
        this.$router.push("/error-page");
      } finally {
        this.loading = false;
      }
    },

    // Holt den Kundennamen mit der GUID
    async fetchCustomerName() {
      if (!this.guidIsValid) return;
      const guid = this.customerGuid;

      try {
        const response = await axios.get(
          `http://localhost/reservation-api/order/get_customer_name.php?guid=${guid}`
        );
        if (response.data.status === "success") {
          this.customerName = response.data.name;
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

    // Holt die Speisen aus der Datenbank
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

    // Filtert die Speisen basierend auf der Kategorie
    filteredItems(category) {
      return this.menuItems.filter((item) => item.category === category);
    },

    // Fügt einen Artikel zum Warenkorb hinzu
    addToCart(item) {
      this.cartItems.push(item);
      this.totalPrice += parseFloat(item.price);
    },

    // Bestellvorgang abschließen
    handleOrderCompletion() {
      this.cartItems = [];
      this.totalPrice = 0;
      this.showCheckout = false;
    },

    // Checkout Fenster schließen und zurück zum Shop
    handleContinueShopping() {
      this.showCheckout = false;
    },

    // Bestellen - Daten an die API senden
    async placeOrder() {
      const orderData = {
        guid: this.customerGuid,
        name: this.customerName, // Kundennamen
        orderDetails: this.cartItems.map((item) => item.id), // IDs der bestellten Gerichte
        totalPrice: this.totalPrice,
      };

      try {
        const response = await axios.post(
          "http://localhost/reservation-api/order/save_order.php",
          orderData
        );
        if (response.data.status === "success") {
          this.handleOrderCompletion();
        } else {
          console.error(
            "Fehler beim Speichern der Bestellung:",
            response.data.message
          );
          alert("Fehler beim Speichern der Bestellung");
        }
      } catch (error) {
        console.error("Fehler beim Bestellvorgang:", error);
        alert("Fehler beim Bestellen. Bitte versuchen Sie es später erneut.");
      }
    },
  },
};
</script>

<style scoped>
/* Stil für den Shop */
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
</style>
