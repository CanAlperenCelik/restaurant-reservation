<template>
  <div>
    <!-- Benutzer-Reservierungsseite -->
    <ReservationPage @new-reservation="addReservation" />

    <!-- Admin-Ansicht der Reservierungen -->
    <ReservationsAdmin :reservations="reservations" />
  </div>
</template>

<script>
import AdminView from "./ReservationAdmin.vue";
import ReservationPage from "./ReservationPage.vue";

export default {
  components: {
    ReservationPage,
    AdminView,
  },
  data() {
    return {
      reservations: [], // Liste der Reservierungen
    };
  },
  methods: {
    // Methode, um neue Reservierung zur Liste hinzuzufügen
    addReservation(reservation) {
      console.log("Neue Reservierung empfangen:", reservation);
      const newReservation = {
        ...reservation,
        id: Date.now(), // Eindeutige ID basierend auf dem Zeitstempel
        status: "offen", // Standardstatus für neue Reservierungen
      };
      this.reservations.push(newReservation);
      console.log("Aktuelle Reservierungen:", this.reservations);
    },
  },
};
</script>
