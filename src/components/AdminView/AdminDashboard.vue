<template>
  <div class="admin-dashboard">
    <!-- Navigation Bar -->
    <nav class="admin-nav">
      <ul>
        <li>
          <router-link to="/admin/reservations">Reservierungen</router-link>
        </li>
        <li>
          <router-link to="/admin/orders">Bestellungen</router-link>
        </li>
        <li>
          <router-link to="/admin/table-view">Tischansicht</router-link>
        </li>
      </ul>
    </nav>

    <!-- Active Route Content -->
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
};
</script>

<style scoped>
/* Admin Dashboard Styling */
.admin-dashboard {
  background-color: #1a1a1a; /* Dunkler Hintergrund */
  color: #f5f5f5; /* Heller Text */
  min-height: 100vh; /* Vollbildhöhe */
  font-family: "Arial", sans-serif;
  display: flex;
  flex-direction: column;
}

.admin-nav {
  background-color: #333; /* Dunkler Navigationshintergrund */
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); /* Leichter Schatten */
}

.admin-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap; /* Links umbrechen, wenn kein Platz mehr vorhanden ist */
  justify-content: center;
  gap: 15px; /* Abstand zwischen Links */
}

.admin-nav li {
  flex: 1 1 auto; /* Flexibles Layout für die Links */
  display: flex;
  justify-content: center;
}

.admin-nav a {
  text-decoration: none;
  font-size: 1.2rem;
  color: #f5f5f5; /* Weißer Linktext */
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
  text-align: center; /* Zentrierter Text */
  flex: 1; /* Passt die Breite automatisch an */
}

.admin-nav a:hover {
  background-color: #e3b23c; /* Goldener Hover-Effekt */
  color: black; /* Schwarzer Text bei Hover */
}

.admin-content {
  padding: 40px; /* Abstand für den Inhalt */
  flex-grow: 1;
  background-color: #222; /* Etwas hellerer Hintergrund für den Hauptinhalt */
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5); /* Innerer Schatten */
  border-radius: 8px;
  margin: 20px auto; /* Zentriert mit Abstand */
  width: 90%; /* Breite von 90% des Bildschirms */
  max-width: 1200px; /* Maximalbreite */
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .admin-nav ul {
    flex-direction: column; /* Navigation vertikal */
  }

  .admin-nav li {
    flex: none; /* Links in voller Breite */
  }

  .admin-nav a {
    flex: none; /* Keine flexible Breite */
    width: 100%; /* Buttons nehmen die volle Breite ein */
  }

  .admin-content {
    padding: 20px; /* Weniger Abstand auf kleinen Bildschirmen */
  }
}
</style>
