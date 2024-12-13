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
    customerName: {
      type: String,
      required: true,
    },
    customerGuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showThankYouPopup: false,
      errorMessage: null,
    };
  },
  methods: {
    placeOrder() {
      const orderData = {
        reservation_code: this.customerGuid, // Verwende die Kunden-ID oder eine andere entsprechende ID für die Reservierung
        order_details: JSON.stringify(this.cartItems), // Die Bestelldetails als JSON
        total_price: this.totalPrice, // Der Gesamtpreis der Bestellung
      };

      console.log("Sende folgende Bestellung:", orderData); // Logge die Bestelldaten vor dem Senden

      // API-Aufruf, um die Bestellung zu speichern
      axios
        .post(
          "http://localhost/reservation-api/order/save_order.php", // Pfad zu deinem PHP-Skript
          orderData,
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          console.log("Serverantwort:", response.data); // Logge die Antwort vom Server
          if (response.data.status === "success") {
            alert("Bestellung erfolgreich gespeichert!");
            this.showThankYouPopup = true;
            setTimeout(() => {
              this.showThankYouPopup = false;
              // Du kannst hier eine Weiterleitung oder eine andere Aktion nach erfolgreicher Bestellung hinzufügen.
            }, 2000);
          } else {
            this.errorMessage = response.data.message;
          }
        })
        .catch((error) => {
          console.error("Es ist ein Fehler aufgetreten:", error);
          this.errorMessage = "Fehler beim Senden der Bestellung.";
        });
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
  top: 10px; /* Positionierung für die Fehlermeldung */
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 0, 0, 0.8); /* Roter Hintergrund */
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 1001; /* Sicherstellen, dass es über anderen Elementen angezeigt wird */
}
</style>
