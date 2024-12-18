<template>
  <div class="home-container">
    <h1>Willkommen im Admin-Bereich</h1>
    <p>Wählen Sie eine Option:</p>
    <div class="button-container">
      <div class="button-section">
        <button @click="goTo('ReservationsAdmin')">Reservierungen</button>
        <p class="description">
          Hier können Sie die Reservierungen der Kunden verwalten. Wenn ein
          Kunde ankommt, bestätigen Sie die Ankunft mit einem Klick auf den
          Haken, weisen Sie einen Tisch zu und beachten Sie die Personenanzahl
          sowie die Kapazität der Tische.
          <br />
          Das Kreuz bedeutet, dass die Reservierung storniert wird, falls der
          Kunde nicht erscheint. Der Stift erlaubt das Bearbeiten von
          Reservierungen, und der Mülleimer löscht die Reservierung.
          <br />
          Zusätzlich können Sie selbst Reservierungen anlegen, wenn ein Kunde
          telefonisch anruft. Geben Sie einfach alle notwendigen Informationen
          ein.
        </p>
      </div>
      <div class="button-section">
        <button @click="goTo('OrdersAdmin')">Bestellungen</button>
        <p class="description">
          Im Reiter "Bestellungen" sehen Sie alle aufgegebenen Bestellungen der
          Kunden. Diese erfolgen oft über die automatische Speisekarte, die per
          E-Mail an den Kunden gesendet wird, und werden den entsprechenden
          Tischen zugeordnet.
        </p>
      </div>
      <div class="button-section">
        <button @click="goTo('TableView')">Tischansicht</button>
        <p class="description">
          In der Tischansicht sehen Sie den Status der Tische: Besetzte Tische
          werden rot markiert. Sie können die Bestellungen pro Tisch einsehen
          und die Rechnung erstellen, um den Tisch wieder freizugeben.
          <br />
          Alternativ können Sie über den "END"-Knopf in den Reservierungen den
          Tisch freigeben, falls dies nicht direkt über die Tischansicht
          erfolgt.
        </p>
      </div>
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
        .push({ name: page })
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
/* Hauptcontainer Styling */
.home-container {
  text-align: center;
  padding: 40px;
  background-color: #1a1a1a; /* Dunkler Hintergrund */
  color: #f5f5f5; /* Heller Text */
  min-height: 100vh; /* Ganze Bildschirmhöhe */
  font-family: "Arial", sans-serif;
}

/* Begrüßung und Beschreibung */
h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

/* Button-Container */
.button-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap; /* Buttons umbrechen bei kleinen Bildschirmen */
}

.button-section {
  text-align: left;
  max-width: 300px;
}

/* Button Styling */
button {
  display: block;
  width: 100%;
  padding: 15px 20px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background-color: #e3b23c; /* Goldener Hintergrund */
  color: black;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Schatten für 3D-Effekt */
}

button:hover {
  background-color: #b17d23; /* Dunkleres Gold bei Hover */
  color: white;
  transform: translateY(-2px); /* Leichter Hover-Effekt */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3); /* Stärkere Schatten */
}

button:active {
  transform: translateY(2px); /* Button drückt sich bei Klick */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Beschreibungstext unter den Buttons */
.description {
  margin-top: 10px;
  font-size: 1rem;
  color: #cccccc; /* Hellerer Farbton für Beschreibung */
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .button-container {
    flex-direction: column; /* Buttons vertikal auf kleinen Geräten */
    gap: 20px;
  }

  .button-section {
    text-align: center;
    max-width: 100%;
  }

  button {
    width: 100%; /* Buttons nehmen die volle Breite ein */
    max-width: 300px; /* Maximale Breite für die Buttons */
    margin: 0 auto; /* Zentrieren */
  }
}
</style>
