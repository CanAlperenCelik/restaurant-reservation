<template>
  <div class="home-container">
    <h1>Willkommen im Admin-Bereich</h1>
    <p>Wählen Sie eine Option:</p>
    <div class="button-container">
      <button @click="goTo('ReservationsAdmin')">Reservierungen</button>
      <button @click="goTo('OrdersAdmin')">Bestellungen</button>
      <button @click="goTo('TableView')">Tischansicht</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "AdminHome",
  methods: {
    goTo(page) {
      this.$router
        .push({ name: page }) // Verwende den Parameter `page`, um die richtige Route anzusteuern
        .then(() => {
          console.log(`Navigated to ${page}`);
        })
        .catch((err) => {
          console.error("Navigation error:", err);
        });
    },
  },
};
</script>

<style scoped>
.home-container {
  text-align: center;
  padding: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
