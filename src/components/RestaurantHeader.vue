<template>
  <header class="restaurant-header">
    <div class="cart">
      <span>🛒 Warenkorb: {{ cartItems.length }} Artikel</span>
      <span>Gesamt: {{ totalPrice.toFixed(2) }} €</span>
      <button @click="goToCheckout">Zur Kasse</button>
    </div>
  </header>
</template>

<script>
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
  },
  methods: {
    goToCheckout() {
      // Emit Event, um die Checkout-Ansicht zu zeigen
      this.$emit("goToCheckout");
    },
  },
};
</script>

<style scoped>
.restaurant-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  color: white;
  z-index: 2;
}

.cart {
  display: flex;
  align-items: center;
  margin-left: auto; /* Verschiebt den Warenkorb nach rechts */
}

.cart span {
  margin-right: 20px;
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
