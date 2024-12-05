<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Kontaktinformationen -->
      <div class="footer-section">
        <h4>Kontaktiere uns</h4>
        <p>T. 07131 163396</p>
        <p>M. kontakt@dalisa-heilbronn.de</p>
        <p>Silcherstraße 63</p>
        <p>74074 Heilbronn</p>
      </div>

      <!-- Öffnungszeiten -->
      <div class="footer-section">
        <h4>Öffnungszeiten</h4>
        <p>
          Montag, Mittwoch & Donnerstag: 11:30 – 14:00 Uhr | 17:00 – 23:00 Uhr
        </p>
        <p>Freitag: 11:30 – 14:00 Uhr | 17:00 – 00:00 Uhr</p>
        <p>Samstag: 17:00 – 00:00 Uhr</p>
        <p>Sonntag: 12:00 – 22:00 Uhr</p>
      </div>
    </div>

    <!-- Footer-Navigation -->
    <div class="footer-bottom">
      <a href="#">Instagram</a> | <a href="#">Impressum</a> |
      <a href="#">Datenschutz</a>
      <button class="scroll-top" @click="scrollToTop">Top</button>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterMain",
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>

<style scoped>
/* Allgemeines Footer-Styling */
.footer {
  background-color: #000;
  color: #fff;
  font-family: Arial, sans-serif;
  padding: 20px 40px;
  text-align: center;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  border-top: 1px solid #666;
  border-bottom: 1px solid #666;
  padding: 20px 0;
}

.footer-section {
  flex: 1 1 300px;
  text-align: left;
}

.footer-section h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #fff;
  text-transform: uppercase;
  border-bottom: 1px solid gold;
}

.footer-section p {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 5px 0;
}

.footer-bottom {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.footer-bottom a {
  color: gold;
  text-decoration: none;
}

.footer-bottom a:hover {
  text-decoration: underline;
}

.scroll-top {
  margin-left: auto;
  background-color: gold;
  color: black;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.scroll-top:hover {
  background-color: #d4af37;
}
</style>
