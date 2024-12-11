<template>
  <div class="shop-container">
    <RestaurantHeader
      :cartItems="cartItems"
      :totalPrice="totalPrice"
      @goToCheckout="showCheckout = true"
    />
    <h1>Herzlich willkommen, {{ customerName }}!</h1>
    <div class="shop-content">
      <nav class="category-sidebar">
        <ul>
          <li><a href="#Vorspeise">Vorspeisen</a></li>
          <li><a href="#Hauptgericht">Hauptspeise</a></li>
          <li><a href="#Dessert">Dessert</a></li>
          <li><a href="#Getränk">Getränk</a></li>
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
            <div v-if="item.image_url && item.image_url.endsWith('.mp4')">
              <video
                :src="item.image_url"
                controls
                class="menu-item-video"
              ></video>
            </div>
            <div v-else>
              <img
                :src="item.image_url || 'path/to/placeholder.jpeg'"
                :alt="item.name"
                class="menu-item-image"
              />
            </div>
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
            <video
              :src="item.image_url"
              controls
              class="menu-item-video"
            ></video>

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
            <!-- <div v-if="item.image_url && item.image_url.endsWith('.mp4')">
              <video
                :src="item.image_url"
                controls
                class="menu-item-video"
              ></video>
            </div>
            <div v-else>
              <img
                :src="item.image_url || 'path/to/placeholder.jpg'"
                :alt="item.name"
                class="menu-item-image"
              />
            </div> -->
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p>{{ item.price }} €</p>
            <button @click="addToCart(item)">In den Warenkorb</button>
          </div>
        </section>

        <section id="Getränk">
          <h2>Getränke</h2>
          <div
            class="item"
            v-for="item in filteredItems('Getränk')"
            :key="item.id"
          >
            <div v-if="item.image_url && item.image_url.endsWith('.mp4')">
              <video
                :src="item.image_url"
                controls
                class="menu-item-video"
              ></video>
            </div>
            <div v-else>
              <img
                :src="item.image_url || 'path/to/placeholder.jpg'"
                :alt="item.name"
                class="menu-item-image"
              />
            </div>
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
      customerGuid: "",
      customerName: "",
      menuItems: [],
      cartItems: [],
      totalPrice: 0,
      showCheckout: false,
      guidIsValid: false,
      loading: true,
    };
  },
  mounted() {
    this.fetchCustomerInfo();
    this.fetchMenuItems();
  },
  methods: {
    async fetchCustomerInfo() {
      const guid = this.$route.params.guid;
      this.customerGuid = guid;

      try {
        const response = await axios.get(
          `http://localhost/reservation-api/order/check_guid.php?guid=${guid}`
        );
        if (response.data.status === "success") {
          this.guidIsValid = true;
          this.fetchCustomerName();
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
      return this.menuItems.filter((item) => {
        if (!item.image_url.startsWith("http")) {
          item.image_url = `http://localhost/path/to/images/${item.image_url}`;
        }
        return item.category === category;
      });
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

    async placeOrder() {
      const orderData = {
        guid: this.customerGuid,
        name: this.customerName,
        orderDetails: this.cartItems.map((item) => item.id),
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
/* Styling für den Shop */
.shop-container {
  background-color: black;
  color: white;
}

.category-sidebar {
  width: 240px;
  background: black;
  color: white;
  padding: 20px;
}

.category-sidebar li {
  margin-bottom: 15px;
}

.category-sidebar a {
  color: #e3b23c;
  font-size: 1.2rem;
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
  background-color: black;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.menu-items .item:hover {
  background-color: #e3b23c;
}

.menu-item-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
}
.menu-item-video {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #e3b23c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #c2871f;
}

@media (max-width: 768px) {
  .shop-container {
    display: block;
  }

  .category-sidebar {
    width: 100%;
    padding: 15px;
  }

  .menu-items {
    padding: 10px;
  }
}
</style>
