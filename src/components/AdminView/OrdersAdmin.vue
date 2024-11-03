<template>
  <div class="order-container">
    <h1>Alle Bestellungen</h1>
    <button @click="goBack">Zurück zum Deckblatt</button>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Kundenname</th>
          <th>Bestellungsdetails</th>
          <th>Gesamtpreis</th>
          <th>Bestelldatum</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in orders" :key="order.id">
          <td>{{ index + 1 }}</td>
          <td>{{ order.name }}</td>
          <td>
            <ul v-if="order.order_details && order.order_details.length">
              <li v-for="(item, idx) in order.order_details" :key="idx">
                <!-- Hier wird überprüft, ob item ein Objekt ist -->
                <template v-if="typeof item === 'object'">
                  {{ item.name }} - {{ item.price }} €
                  <!-- Name und Preis für Objekte -->
                </template>
                <template v-else>
                  {{ item }}
                  <!-- Für den Fall, dass es sich um einen String handelt -->
                </template>
              </li>
            </ul>
            <span v-else>Keine Details verfügbar</span>
          </td>
          <td>{{ order.total_price }} €</td>
          <td>{{ formatOrderDate(order.order_date) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "OrdersAdmin",
  data() {
    return {
      orders: [], // Array für Bestellungen
    };
  },
  mounted() {
    this.fetchOrders(); // Bestellungen abrufen, wenn die Komponente geladen wird
  },
  methods: {
    goBack() {
      this.$router.push({ name: "AdminHome" }); // Zurück zum Deckblatt
    },
    async fetchOrders() {
      try {
        const response = await axios.get(
          "http://localhost/reservation-api/get_orders.php"
        );
        if (response.data.status === "success") {
          this.orders = response.data.orders;
        } else {
          console.error(
            "Fehler beim Abrufen der Bestellungen:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Bestellungen:", error);
      }
    },
    formatOrderDate(orderDate) {
      return new Date(orderDate).toLocaleString();
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}
</style>
