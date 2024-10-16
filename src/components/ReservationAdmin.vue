<template>
  <div class="reservation-container">
    <h1>Alle Reservierungen</h1>

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
          <th>Status</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reservation, index) in reservations" :key="reservation.id">
          <td>{{ index + 1 }}</td>
          <td>{{ reservation.surename }}</td>
          <td>{{ reservation.name }}</td>
          <td>{{ reservation.date }}</td>
          <td>{{ reservation.time }}</td>
          <td>{{ reservation.personCount }}</td>
          <td>{{ reservation.email }}</td>
          <td>
            <span v-if="reservation.status === 'Angekommen'" class="confirmed"
              >Angekommen</span
            >
            <span v-if="reservation.status === 'Storniert'" class="rejected"
              >Storniert</span
            >
            <span v-if="reservation.status === 'offen'" class="pending"
              >Offen</span
            >
          </td>
          <td>
            <button
              @click="confirmReservation(reservation.id)"
              :disabled="reservation.status !== 'offen'"
            >
              ✔️
            </button>
            <button
              @click="rejectReservation(reservation.id)"
              :disabled="reservation.status !== 'offen'"
            >
              ❌
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ReservationsAdmin",
  data() {
    return {
      reservations: [], // Array für die Reservierungen
    };
  },
  mounted() {
    this.fetchReservations(); // Beim Laden der Komponente Reservierungen abrufen
  },
  methods: {
    async fetchReservations() {
      try {
        const response = await axios.get(
          "http://localhost/reservation-api/get_reservations.php"
        );
        this.reservations = response.data; // Reservierungen in der Komponente speichern
      } catch (error) {
        console.error("Fehler beim Abrufen der Reservierungen:", error);
      }
    },
    async confirmReservation(id) {
      this.updateReservationStatus(id, "Angekommen");
    },
    async rejectReservation(id) {
      this.updateReservationStatus(id, "Storniert");
    },
    async updateReservationStatus(id, status) {
      try {
        const response = await axios.post(
          "http://localhost/reservation-api/update_reservation_status.php",
          {
            id,
            status,
          }
        );
        if (response.data.status === "success") {
          this.fetchReservations(); // Reservierungen neu laden
        } else {
          console.error(
            "Fehler beim Aktualisieren des Status:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Fehler beim Aktualisieren des Status:", error);
      }
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

.confirmed {
  color: green;
}

.rejected {
  color: red;
}

.pending {
  color: orange;
}
</style>
