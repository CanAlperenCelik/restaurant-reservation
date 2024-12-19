<template>
  <div class="table-view">
    <h1>Tischansicht</h1>
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
        <h2>Informationen zum Tisch {{ selectedTable.name }}</h2>
        <p>Kapazität: {{ selectedTable.capacity }} Personen</p>
        <p>
          Status: {{ selectedTable.status === "occupied" ? "Besetzt" : "Frei" }}
        </p>
        <h3>Bestellungen:</h3>
        <ul v-if="selectedTable.orders.length">
          <li v-for="order in selectedTable.orders" :key="order">
            {{ order }}
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
      tables: [], // Array der Tische
      showPopup: false, // Popup-Status
      selectedTable: null, // Aktuell ausgewählter Tisch
    };
  },
  mounted() {
    this.fetchTables(); // Daten beim Mounten abrufen
  },
  methods: {
    async fetchSessionId() {
      try {
        const response = await axios.get(
          "http://localhost/reservation-api/session/get_current_session.php"
        );

        if (response.data.status === "success") {
          return response.data.session_id || response.data.session_ids;
        } else {
          console.error(
            "Fehler beim Abrufen der Session-ID:",
            response.data.message
          );
          alert("Keine offene Session gefunden.");
          return null;
        }
      } catch (error) {
        console.error("Fehler bei der Anfrage zur Session-ID:", error);
        return null;
      }
    },
    async fetchTables() {
      try {
        const response = await axios.get(
          "http://localhost/reservation-api/tables/get_tables_status.php"
        );

        if (response.data && Array.isArray(response.data)) {
          this.tables = response.data.map((table) => ({
            ...table,
            session_id: table.session_id || null, // Sicherstellen, dass session_id korrekt gesetzt wird
            orders: table.orders || [], // Bestellungen als leeres Array initialisieren
          }));
          console.log("Tische erfolgreich geladen:", this.tables);
        } else {
          console.error(
            "Falsches Datenformat oder keine Tische:",
            response.data
          );
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Tischdaten:", error);
      }
    },
    // Popup für besetzten Tisch öffnen
    openTablePopup(table) {
      console.log("Popup für Tisch", table.name); // Debugging-Zeile
      console.log("Ausgewählter Tisch:", table); // Debugging-Ausgabe
      console.log("Session-ID:", table.session_id); // Überprüfen, ob die session_id vorhanden ist
      console.log("Session-GUID:", table.reservation_code); // Überprüfen, ob die session_id vorhanden ist
      console.log("Bestellungen:", table.orders); // Alle Bestellungen des Tisches anzeigen

      this.selectedTable = table;
      this.showPopup = true;
    },
    // Popup schließen
    closePopup() {
      this.selectedTable = null;
      this.showPopup = false;
    },
    // Tisch einem Kunden zuweisen
    async assignTable(table) {
      try {
        if (!table.reservation_id) {
          alert("Keine aktive Reservierung für diesen Tisch.");
          return;
        }
        const response = await axios.post(
          "http://localhost/reservation-api/start_session.php",
          {
            reservation_id: table.reservation_id,
            table_id: table.id,
          }
        );
        if (response.data.status === "success") {
          this.fetchTables(); // Tabellen erneut laden
          console.log(`Tisch ${table.name} erfolgreich zugewiesen.`);
        } else {
          console.error("Fehler beim Zuweisen des Tisches:", response.data);
        }
      } catch (error) {
        console.error("Fehler beim Zuweisen des Tisches:", error);
      }
    },
    async generateBill() {
      try {
        // Session-ID abrufen
        const sessionId = await this.fetchSessionId();

        if (!sessionId) {
          return; // Keine Session gefunden
        }

        // Daten des Tisches und Bestellungen vorbereiten
        const table = this.selectedTable;
        const orders = table.orders;
        if (orders.length === 0) {
          alert("Keine Bestellungen für diesen Tisch.");
          return;
        }

        // Textinhalt für die Rechnung erstellen
        let billContent = `Rechnung für Tisch ${table.name}\n\n`;
        billContent += `Kapazität: ${table.capacity} Personen\n`;
        billContent += `Status: ${
          table.status === "occupied" ? "Besetzt" : "Frei"
        }\n\n`;
        billContent += "Bestellungen:\n";
        orders.forEach((order, index) => {
          billContent += `${index + 1}. ${order}\n`;
        });

        // Textdatei erstellen und herunterladen
        const blob = new Blob([billContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `rechnung_tisch_${table.name}.txt`; // Dateiname
        link.click(); // Klick auf den Link simulieren, um den Download zu starten

        // Session beenden
        const sessionData = { session_id: sessionId };
        const response = await axios.post(
          "http://localhost/reservation-api/session/end_session.php",
          sessionData
        );

        if (response.data.status === "success") {
          alert("Session erfolgreich beendet und Rechnung heruntergeladen.");
        } else {
          console.error(
            "Fehler beim Beenden der Session:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Fehler bei der Anfrage zum Beenden der Session:", error);
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
</style>
