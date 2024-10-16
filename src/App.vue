<template>
  <div id="app">
    <!-- Hier wird der Router-View für die Seiten verwendet -->
    <router-view
      @new-reservation="addReservation"
      :reservations="reservations"
    />
  </div>
</template>

<script>
import { ref } from "vue"; // Vue Composition API importieren

export default {
  name: "App",

  setup() {
    // Array zur Verwaltung der Reservierungen
    const reservations = ref([]);

    // Funktion, um eine neue Reservierung hinzuzufügen
    const addReservation = (reservation) => {
      reservations.value.push(reservation);
      console.log("Neue Reservierung hinzugefügt:", reservation); // Debugging-Ausgabe
    };

    return {
      reservations,
      addReservation,
    };
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  width: 100%;
  background-color: black;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: white;
  height: 100vh;
}
</style>
