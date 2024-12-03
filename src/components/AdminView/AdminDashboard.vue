<template>
  <div>
    <nav>
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

    <!-- Hier wird die aktive Route angezeigt -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
};
</script>

<style scoped>
nav ul {
  list-style-type: none;
  display: flex;
  gap: 20px;
}

nav ul li {
  display: inline;
}

nav ul li a {
  text-decoration: none;
  color: blue;
}
</style>
