<template>
  <div class="reservation">
    <h1>Tisch reservieren</h1>

    <!-- Schritt 1: Personenanzahl auswählen -->
    <div>
      <h2>Wählen Sie die Personenanzahl:</h2>
      <div class="person-count-buttons">
        <button
          v-for="count in personCountOptions"
          :key="count"
          @click="selectPersonCount(count)"
          :class="{ 'selected-person': reservation.personCount === count }"
        >
          {{ count }} Personen
        </button>
      </div>
      <!-- Anzeige der aktuell ausgewählten Personenanzahl -->
      <p v-if="reservation.personCount">
        Aktuell ausgewählte Personenanzahl: {{ reservation.personCount }}
      </p>
    </div>

    <!-- Schritt 2: Datum auswählen -->
    <div>
      <h2>Wählen Sie das Datum:</h2>
      <input
        type="date"
        v-model="reservation.date"
        @change="validateDate"
        :min="today"
        :class="{ 'is-invalid-date': isPastDate(reservation.date) }"
        required
      />
      <p v-if="reservation.date">
        Aktuell ausgewähltes Datum: {{ reservation.date }}
      </p>
    </div>

    <!-- Schritt 3: Uhrzeit auswählen -->
    <div v-if="currentStep >= 3">
      <h2>Wählen Sie eine Uhrzeit:</h2>
      <button
        v-for="time in availableTimes"
        :key="time"
        @click="selectTime(time)"
        :class="{ 'selected-time': reservation.time === time }"
      >
        {{ time }}
      </button>
      <p v-if="reservation.time">
        Aktuell ausgewählte Uhrzeit: {{ reservation.time }}
      </p>
    </div>

    <!-- Schritt 4: Kontaktinformationen eingeben -->
    <div v-if="currentStep >= 4">
      <h2>Kontaktinformationen</h2>
      <form @submit.prevent="confirmAndReturn">
        <div class="form-group">
          <div class="form-group">
            <label for="name">Vorname:</label>
            <input
              type="text"
              id="firstname"
              v-model="reservation.firstname"
              @input="validateName"
              :class="{ 'is-invalid': errors.firstname }"
              required
            />
            <span v-if="errors.firstname" class="error-message">
              Bitte geben Sie nur Buchstaben ein.
            </span>
          </div>
          <label for="name">Name:</label>
          <input
            type="text"
            id="lastname"
            v-model="reservation.lastname"
            @input="validateName"
            :class="{ 'is-invalid': errors.lastname }"
            required
          />
          <span v-if="errors.lastname" class="error-message">
            Bitte geben Sie nur Buchstaben ein.
          </span>
        </div>

        <div class="form-group">
          <label for="phone">Telefonnummer:</label>
          <input
            type="tel"
            id="phone"
            v-model="reservation.phone"
            @input="validatePhone"
            :class="{ 'is-invalid': errors.phone }"
            required
          />
          <span v-if="errors.phone" class="error-message">
            Nur Zahlen und das "+"-Zeichen sind erlaubt.
          </span>
        </div>

        <div class="form-group">
          <label for="email">E-Mail:</label>
          <input
            type="email"
            id="email"
            v-model="reservation.email"
            @input="validateEmail"
            :class="{ 'is-invalid': errors.email }"
            required
          />
          <span v-if="errors.email" class="error-message">
            Bitte geben Sie eine gültige E-Mail-Adresse ein.
          </span>
        </div>

        <!-- Hier den Button zum Absenden der Reservierung hinzufügen -->
        <button type="submit" :disabled="hasErrors">
          Reservierung abschicken
        </button>
      </form>
    </div>

    <!-- Anzeige der aktuellen Reservierungen -->
    <div v-if="reservations.length">
      <h2>Aktuelle Reservierungen</h2>
      <ul>
        <li v-for="(res, index) in reservations" :key="index">
          {{ res.firstname }} -{{ res.lastname }} - {{ res.phone }} -
          {{ res.email }} - {{ res.date }} um {{ res.time }} für
          {{ res.personCount }} Personen
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ReservationPage",
  data() {
    return {
      currentStep: 1,
      personCountOptions: [2, 3, 4, 5, 6],
      availableTimes: this.generateTimes(),
      reservation: {
        firstname: "", // Vorname
        lastname: "", // Nachname
        phone: "",
        email: "",
        date: "",
        time: "",
        personCount: 0,
      },

      reservations: [],
      errors: {
        surename: false,
        name: false,
        phone: false,
        email: false,
        date: false, // Fehler für Datum hinzugefügt
      },
      today: new Date().toISOString().split("T")[0], // Heutiges Datum für das 'min'-Attribut
    };
  },
  computed: {
    hasErrors() {
      // Fehler für das Datum wird jetzt auch berücksichtigt
      return (
        this.errors.surename ||
        this.errors.name ||
        this.errors.phone ||
        this.errors.email ||
        this.errors.date
      );
    },
  },
  methods: {
    selectPersonCount(count) {
      this.reservation.personCount = count;
      this.currentStep = 2; // Gehe zum nächsten Schritt
    },

    validateDate() {
      if (this.isPastDate(this.reservation.date)) {
        this.errors.date = true;
      } else {
        this.errors.date = false;
        this.currentStep = 3; // Gehe zum nächsten Schritt
      }
    },

    selectTime(time) {
      this.reservation.time = time;
      this.currentStep = 4; // Gehe zum nächsten Schritt
    },
    isPastDate(selectedDate) {
      const today = new Date().toISOString().split("T")[0];
      return selectedDate < today;
    },
    generateTimes() {
      const times = [];
      let startTime = new Date();
      startTime.setHours(14, 30, 0);

      while (
        startTime.getHours() < 23 ||
        (startTime.getHours() === 23 && startTime.getMinutes() === 0)
      ) {
        const hours = startTime.getHours().toString().padStart(2, "0");
        const minutes = startTime.getMinutes().toString().padStart(2, "0");
        times.push(`${hours}:${minutes}`);
        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      return times;
    },

    validateName() {
      const regex = /^[A-Za-z\s]*$/;
      this.errors.firstname = !regex.test(this.reservation.firstname);
      this.errors.lastname = !regex.test(this.reservation.lastname);
    },

    validatePhone() {
      const regex = /^[\d+]*$/;
      this.errors.phone = !regex.test(this.reservation.phone);
    },
    validateEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.errors.email = !regex.test(this.reservation.email);
    },

    confirmAndReturn() {
      const reservationData = {
        firstname: this.reservation.firstname,
        lastname: this.reservation.lastname,
        phone: this.reservation.phone,
        email: this.reservation.email,
        date: this.reservation.date,
        time: this.reservation.time,
        personCount: this.reservation.personCount,
      };

      console.log("Sende folgende Reservierung:", reservationData); // Logge die Daten vor dem Senden

      axios
        .post(
          "http://localhost/reservation-api/reservation/insert_reservation.php",
          reservationData,

          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          console.log("Serverantwort:", response.data); // Logge die Antwort vom Server
          if (response.data.status === "success") {
            alert("Reservierung erfolgreich!");
            this.$router.push("/"); // Nach erfolgreicher Reservierung zur Startseite umleiten
          } else {
            alert("Fehler: " + response.data.message);
          }
        })
        .catch((error) => {
          console.error("Es ist ein Fehler aufgetreten:", error);
          alert("Fehler beim Senden der Daten.");
        });
    },
  },
};
</script>

<style scoped>
.reservation {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
}
.person-count-buttons button,
button {
  margin: 5px;
  padding: 10px;
  font-size: 16px;
  background-color: #28a745; /* Standard-Hintergrundfarbe für nicht ausgewählte Buttons */
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #218838; /* Hover-Effekt */
}

/* Rot markierte Personenanzahl-Buttons */
.selected-person {
  background-color: red !important; /* !important stellt sicher, dass die rote Farbe Priorität hat */
  color: white;
}

/* Rot markierte Uhrzeit-Buttons */
.selected-time {
  background-color: red !important; /* !important stellt sicher, dass die rote Farbe Priorität hat */
  color: white;
}

.is-invalid-date {
  border: 1px solid red;
}

.is-invalid-date {
  border: 1px solid red;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

input {
  padding: 8px;
  font-size: 16px;
  width: 100%;
}

.error-message {
  color: red;
  font-size: 12px;
}

.is-invalid {
  border: 1px solid red;
}

ul {
  list-style-type: none;
}

ul li {
  margin-bottom: 10px;
}
</style>
