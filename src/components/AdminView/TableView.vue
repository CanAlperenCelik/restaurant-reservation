<template>
  <div class="table-view">
    <h1>Tischübersicht</h1>
    <!-- Tische im Grid anzeigen -->
    <div class="tables-grid">
      <div
        v-for="table in tables"
        :key="table.id"
        :class="[
          'table',
          table.status === 'occupied' ? 'occupied' : 'available',
        ]"
        @click="
          table.status === 'occupied'
            ? openTablePopup(table)
            : assignTable(table)
        "
      >
        <p>{{ table.name }}</p>
        <p>{{ table.capacity }} Personen</p>
      </div>
    </div>

    <!-- Popup für besetzte Tische -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <h2>Informationen zu Tisch {{ selectedTable.name }}</h2>
        <p>Kapazität: {{ selectedTable.capacity }} Personen</p>
        <p>
          Status: {{ selectedTable.status === "occupied" ? "Besetzt" : "Frei" }}
        </p>
        <h3>Aktuelle Bestellungen:</h3>
        <ul v-if="selectedTable.orders && selectedTable.orders.length">
          <li v-for="(order, index) in selectedTable.orders" :key="index">
            <div v-for="item in order.order_details" :key="item.name">
              {{ item.name }} - {{ item.price }} €
            </div>
          </li>
        </ul>
        <p v-else>Keine Bestellungen für diesen Tisch</p>
        <button @click="closePopup">Schließen</button>
        <button @click="generateBill">Rechnung erstellen</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tables: [], // Tische
      showPopup: false, // Popup-Status
      selectedTable: null, // Aktueller Tisch
    };
  },
  mounted() {
    this.fetchTables(); // Tische laden, sobald die Seite geladen ist
  },
  methods: {
    async fetchTables() {
      try {
        const response = await axios.get(
          "http://localhost/reservation-api/tables/get_tables_status.php"
        );
        if (response.data && Array.isArray(response.data)) {
          this.tables = response.data.map((table) => ({
            ...table,
            orders: table.orders.map((order) => ({
              ...order,
              order_details: Array.isArray(order.order_details)
                ? order.order_details
                : JSON.parse(order.order_details),
            })),
          }));
          console.log("Tische erfolgreich geladen:", this.tables);
        } else {
          console.error("Ungültige Antwort:", response.data);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Tische:", error);
      }
    },
    openTablePopup(table) {
      this.selectedTable = table;
      this.showPopup = true;
    },
    closePopup() {
      this.selectedTable = null;
      this.showPopup = false;
    },
    async assignTable(table) {
      // Funktion für das Zuweisen eines Tisches (falls notwendig)
      alert(`Tisch ${table.name} ist frei und kann zugewiesen werden.`);
    },
    async generateBill() {
      try {
        if (!this.selectedTable || !this.selectedTable.orders.length) {
          alert("Keine Bestellungen für diesen Tisch.");
          return;
        }

        const orders = this.selectedTable.orders;
        let billContent = `Rechnung für Tisch ${this.selectedTable.name}\n\n`;
        orders.forEach((order, index) => {
          billContent += `Bestellung ${index + 1}:\n`;
          order.order_details.forEach((item) => {
            billContent += ` - ${item.name}: ${item.price} €\n`;
          });
          billContent += `Gesamtpreis: ${order.total_price} €\n\n`;
        });

        // Datei erstellen und herunterladen
        const blob = new Blob([billContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Rechnung_Tisch_${this.selectedTable.name}.txt`;
        link.click();
        alert("Rechnung wurde erstellt und heruntergeladen.");
      } catch (error) {
        console.error("Fehler bei der Rechnungserstellung:", error);
      }
    },
  },
};
</script>
<style scoped>
.table-view {
  text-align: center;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.table {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
}

.available {
  background-color: green;
  color: white;
}

.occupied {
  background-color: red;
  color: white;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: black;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

button {
  margin: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}
</style>
