<template>
  <div class="reservation-container">
    <h1>Reservierungen des Tages</h1>
    <button @click="goBack">Zurück zum Deckblatt</button>
    <button @click="openReservationForm">Neue Reservierung hinzufügen</button>

    <!-- Datumsauswahl für Kalenderansicht -->
    <label for="reservation-date">
      Wähle ein Datum:
      <input
        type="date"
        v-model="selectedDate"
        id="reservation-date"
        @change="fetchReservations"
      />
    </label>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Vorname</th>
          <th>Name</th>
          <th>Datum</th>
          <th>Zeit</th>
          <th>Personen</th>
          <th>E-Mail</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reservation, index) in reservations" :key="reservation.id">
          <td>{{ index + 1 }}</td>
          <td>{{ reservation.firstname }}</td>
          <td>{{ reservation.lastname }}</td>
          <td>{{ reservation.date }}</td>
          <td>{{ reservation.time }}</td>
          <td>{{ reservation.personCount }}</td>
          <td>{{ reservation.email }}</td>
          <td>{{ reservation.phone }}</td>
          <td>
            <span :class="statusClass(reservation.status)">{{
              reservation.status
            }}</span>
          </td>
          <td>
            <div v-if="reservation.status === 'Pending'">
              <button @click="confirmReservation(reservation.id)">✔️</button>
              <button @click="rejectReservation(reservation.id)">❌</button>
            </div>
            <div v-else-if="reservation.status === 'Angekommen'">
              <button @click="openTableAssignment(reservation)">
                Tisch zuweisen
              </button>
            </div>
            <button @click="editReservation(reservation)">✏️</button>
            <button @click="deleteReservation(form.id)">🗑️</button>
            <button @click="endSession">END</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <h2>
          {{
            formMode === "create"
              ? "Neue Reservierung"
              : "Reservierung bearbeiten"
          }}
        </h2>
        <form @submit.prevent="submitForm">
          <label>Vorname: <input v-model="form.firstname" required /></label>
          <label>Name: <input v-model="form.lastname" required /></label>
          <label
            >Datum: <input type="date" v-model="form.date" required
          /></label>
          <label
            >Zeit: <input type="time" v-model="form.time" required
          /></label>
          <label
            >Personen:
            <input type="number" v-model="form.personCount" required min="1"
          /></label>
          <label
            >Phone: <input type="phone" v-model="form.phone" required
          /></label>
          <label
            >E-Mail: <input type="email" v-model="form.email" required
          /></label>
          <button type="submit">Speichern</button>
          <button type="button" @click="closeForm">Abbrechen</button>
        </form>
      </div>
    </div>

    <!-- Table Selection Modal -->
    <div v-if="showTableModal" class="modal">
      <div class="modal-content">
        <h2>Wählen Sie einen Tisch aus</h2>
        <select v-model="selectedTableId">
          <option
            v-for="table in availableTables"
            :key="table.id"
            :value="table.id"
          >
            {{ table.name }} (Kapazität: {{ table.capacity }})
          </option>
        </select>
        <button
          @click="confirmReservationWithTable(selectedReservation.id)"
          :disabled="!selectedTableId"
        >
          Bestätigen
        </button>
        <button @click="closeTableModal">Abbrechen</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      reservations: [],
      selectedDate: new Date().toISOString().split("T")[0], // Standardmäßig auf das heutige Datum gesetzt
      showForm: false,
      formMode: "create",
      form: {
        id: null,
        firstname: "",
        lastname: "",
        date: "",
        time: "",
        personCount: 1,
        email: "",
        phone: "",
      },
      selectedReservation: null,
      selectedTableId: null,
      availableTables: [],
      showTableModal: false,
    };
  },
  mounted() {
    this.fetchReservations();
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
    async endSession() {
      try {
        // Session-ID abrufen
        const sessionId = await this.fetchSessionId();

        if (!sessionId) {
          return; // Keine Session gefunden
        }

        const sessionData = { session_id: sessionId };

        // POST-Request zum Beenden der Session
        const response = await axios.post(
          "http://localhost/reservation-api/session/end_session.php",
          sessionData
        );

        if (response.data.status === "success") {
          alert("Session erfolgreich beendet.");
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
    // async endSession() {
    //   try {
    //     const sessionData = {
    //       session_id: 5, // Ersetzen Sie die `5` durch die tatsächliche Session-ID
    //     };

    //     const response = await axios.post(
    //       "http://localhost/reservation-api/session/end_session.php",
    //       sessionData
    //     );

    //     if (response.data.status === "success") {
    //       alert("Session erfolgreich beendet.");
    //       // Optional: Weiterleitung nach Beenden der Sitzung
    //       this.$router.push({ name: "Login" }); // Navigieren Sie zum Login-Bildschirm
    //     } else {
    //       console.error(
    //         "Fehler beim Beenden der Session:",
    //         response.data.message
    //       );
    //     }
    //   } catch (error) {
    //     console.error("Fehler bei der Anfrage zum Beenden der Session:", error);
    //   }
    // },
    goBack() {
      this.$router.push({ name: "AdminHome" });
    },
    async deleteReservation(id) {
      if (confirm("Möchten Sie diese Reservierung wirklich löschen?")) {
        try {
          const response = await axios.post(
            "http://localhost/reservation-api/reservation/delete_reservation.php",
            { id }
          );
          if (response.data.status === "success") {
            alert("Reservierung erfolgreich gelöscht");
            this.fetchReservations(); // Liste nach dem Löschen aktualisieren
          } else {
            console.error(
              "Fehler beim Löschen der Reservierung:",
              response.data.message
            );
          }
        } catch (error) {
          console.error("Fehler bei der Löschanfrage:", error);
        }
      }
    },
    async fetchReservations() {
      try {
        const response = await axios.get(
          "http://localhost/reservation-api/reservation/get_reservations.php",
          {
            params: { date: this.selectedDate },
          }
        );

        console.log(response.data); // Überprüfen der Antwort von der API
        this.reservations = response.data;
      } catch (error) {
        console.error("Fehler beim Abrufen der Reservierungen:", error);
      }
    },

    async confirmReservation(id) {
      const status = "Angekommen"; // Setzen Sie den Status explizit auf "Angekommen"
      await this.updateReservationStatus(id, status); // Übergeben Sie die ID und den Status
      const reservation = this.reservations.find((res) => res.id === id);
      if (reservation) {
        this.openTableAssignment(reservation); // Übergib die vollständige Reservierung
      }
    },

    async rejectReservation(id) {
      const status = "Storniert"; // Setzen Sie den Status explizit auf "Storniert"
      await this.updateReservationStatus(id, status); // Übergeben Sie die ID und den Status
    },

    async updateReservationStatus(id, status) {
      try {
        const response = await axios.post(
          "http://localhost/reservation-api/reservation/update_reservation_status.php",
          { id, status }
        );
        if (response.data.status === "success") {
          this.fetchReservations();
        } else {
          console.error(
            "Fehler beim Aktualisieren des Status:",
            response.data.message || "Unbekannter Fehler"
          );
        }
      } catch (error) {
        console.error(
          "Fehler beim Aktualisieren des Status:",
          error.response ? error.response.data : error.message || error
        );
      }
    },

    statusClass(status) {
      return {
        confirmed: status === "Angekommen",
        rejected: status === "Storniert",
        pending: status === "offen",
      };
    },
    openReservationForm() {
      this.formMode = "create";
      this.showForm = true;
      this.form = {
        id: null,
        firstname: "",
        lastname: "",
        date: "",
        time: "",
        personCount: 1,
        email: "",
        phone: "",
      };
    },
    editReservation(reservation) {
      console.log("Bearbeite Reservierung:", reservation); // Ausgabe der Reservierungsdaten zur Überprüfung
      this.formMode = "edit";
      this.showForm = true;
      this.form = { ...reservation };
    },

    async submitForm() {
      try {
        if (this.formMode === "create") {
          await axios.post(
            "http://localhost/reservation-api/reservation/insert_reservation.php",
            this.form
          );
        } else if (this.formMode === "edit") {
          await axios.post(
            "http://localhost/reservation-api/reservation/edit_reservation.php",
            this.form
          );
        }
        // Nach dem Speichern die Reservierungsliste neu laden und das Formular schließen
        this.fetchReservations();
        this.closeForm();
      } catch (error) {
        console.error("Fehler beim Speichern der Reservierung:", error);
      }
    },

    closeForm() {
      this.showForm = false;
      this.form = {
        id: null,
        surename: "",
        name: "",
        date: "",
        time: "",
        personCount: 1,
        email: "",
        phone: "",
      };
    },
    async fetchAvailableTables(date, time) {
      try {
        const response = await axios.post(
          "http://localhost/reservation-api/tables/get_available_tables.php",
          { date, time }
        );

        if (response.data.status === "success") {
          this.availableTables = response.data.availableTables;
          if (this.availableTables.length === 0) {
            console.warn(
              "Keine verfügbaren Tische gefunden für dieses Datum und diese Uhrzeit."
            );
          }
        } else {
          console.error(
            "Fehler beim Abrufen der verfügbaren Tische:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der verfügbaren Tische:", error);
      }
    },

    openTableAssignment(reservation) {
      this.selectedReservation = reservation; // Fülle die `selectedReservation` mit der vollständigen Reservierung
      this.fetchAvailableTables(reservation.date, reservation.time); // Hole verfügbare Tische
      this.showTableModal = true; // Öffne das Modal zur Tischzuweisung
    },

    async confirmReservationWithTable() {
      if (!this.selectedTableId) {
        alert("Bitte wählen Sie einen Tisch aus.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost/reservation-api/tables/assign_table.php",
          {
            reservation_id: this.selectedReservation.id,
            table_id: this.selectedTableId,
          }
        );

        if (response.data.status === "success") {
          alert("Tisch erfolgreich zugewiesen!");
          this.fetchReservations(); // Reservierungsliste aktualisieren
          this.closeTableModal(); // Modal schließen
        } else {
          console.error("Fehler:", response.data.message);
        }
      } catch (error) {
        console.error("Fehler bei der Tischzuweisung:", error);
      }
    },

    closeTableModal() {
      this.showTableModal = false;
      this.selectedTableId = null; // Zurücksetzen der Auswahl
      this.selectedReservation = null; // Zurücksetzen der Reservierung
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

button {
  cursor: pointer;
  padding: 5px 10px;
  margin: 2px;
}

.confirmed {
  color: green;
}

.rejected {
  color: red;
}

.pending {
  color: orange;
}

/* Modal Popup Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: black;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin-top: 0;
}

.modal-content form {
  display: flex;
  flex-direction: column;
}

.modal-content label {
  margin-bottom: 10px;
}

.modal-content input {
  padding: 8px;
  margin-top: 5px;
}

.modal-content button {
  margin-top: 10px;
  padding: 8px;
  cursor: pointer;
}
</style>
