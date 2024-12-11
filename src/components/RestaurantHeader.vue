<template>
  <header class="restaurant-header">
    <h1>Da Lisa Pizzeria</h1>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: black;
  color: white;
}

.cart {
  display: flex;
  align-items: center;
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
