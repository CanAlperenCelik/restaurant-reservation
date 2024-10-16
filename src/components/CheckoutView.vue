<template>
  <div class="checkout-window">
    <h2>Warenkorb Zusammenfassung</h2>
    <div class="cart-items">
      <div class="cart-item" v-for="item in cartItems" :key="item.id">
        <span>{{ item.name }}</span>
        <span>{{ parseFloat(item.price).toFixed(2) }} €</span>
      </div>
    </div>

    <div class="total-price">
      <h3>Gesamtpreis: {{ totalPrice.toFixed(2) }} €</h3>
    </div>

    <div class="checkout-buttons">
      <button @click="continueShopping">Weiter Einkaufen</button>
      <button @click="placeOrder">Bestellen</button>
    </div>

    <!-- Popup für Danke-Meldung -->
    <div v-if="showThankYouPopup" class="thank-you-popup">
      <p>Danke für die Bestellung!</p>
    </div>

    <!-- Fehler Meldung -->
    <div v-if="errorMessage" class="error-popup">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    cartItems: {
      type: Array,
      default: () => [],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    customerGuid: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showThankYouPopup: false,
      errorMessage: null, // Initialize error message
    };
  },
  methods: {
    async placeOrder() {
      const orderDetails = this.cartItems.map((item) => item.name); // Extract only dish names
      const orderData = {
        guid: this.customerGuid,
        name: this.customerName,
        orderDetails: orderDetails, // Send only dish names
        totalPrice: this.totalPrice,
      };

      try {
        const response = await axios.post(
          "http://localhost/reservation-api/save_order.php",
          orderData
        );
        console.log(response.data); // Log server response

        if (response.data.status === "success") {
          // Bestellung erfolgreich
          this.showThankYouPopup = true;
          setTimeout(() => {
            this.showThankYouPopup = false;
            this.$emit("orderCompleted");
          }, 2000);
        } else {
          // Show error message if order was not successful
          this.errorMessage = response.data.message || "Unbekannter Fehler.";
        }
      } catch (error) {
        console.error("Fehler beim Bestellen:", error);
        this.errorMessage =
          "Fehler beim Bestellen. Bitte versuchen Sie es später erneut."; // Set error message
      }
    },
    continueShopping() {
      this.$emit("continueShopping"); // Event zum weiteren Einkaufen
      this.errorMessage = null; // Clear error message when continuing shopping
    },
  },
};
</script>

<style scoped>
.checkout-window {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
  color: white;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 1000;
  text-align: center;
}

.cart-items {
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total-price {
  margin-bottom: 20px;
}

.checkout-buttons {
  display: flex;
  justify-content: space-between;
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

.thank-you-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 5px;
}

.error-popup {
  position: absolute;
  top: 10px; /* Positioning for the error message */
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 0, 0, 0.8); /* Red background */
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 1001; /* Make sure it's above other elements */
}
</style>
