<template>
  <header class="restaurant-header">
    <div class="menu-icon" @click="toggleMenu">
      <!-- Three lines for the dropdown menu -->
      <span>☰</span>
    </div>

    <!-- Login Button -->
    <div class="login">
      <button @click="toggleLoginModal">Login</button>
    </div>

    <!-- Popdown Menu under the header -->
    <div v-if="showMenu" class="popdown-menu">
      <button v-if="!isReservationPage" @click="goToReservation">
        Reservation
      </button>
      <button v-else @click="goToHome">Startseite</button>
      <button @click="goToMenu">Menu</button>
    </div>
  </header>
  <!-- Login Modal -->
  <div v-if="showLoginModal" class="login-modal">
    <div class="login-modal-content">
      <span class="close" @click="toggleLoginModal">&times;</span>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username:</label>
          <input
            type="text"
            v-model="loginForm.username"
            id="username"
            required
          />
        </div>
        <div class="form-group password-group">
          <label for="password">Password:</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="loginForm.password"
            id="password"
            required
          />
          <span class="password-toggle" @click="togglePasswordVisibility">
            {{ showPassword ? "🙈" : "👁️" }}
          </span>
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showLoginModal: false,
      showMenu: false,
      showPassword: false,
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  computed: {
    isReservationPage() {
      return this.$route.name === "Reservation";
    },
  },
  methods: {
    toggleLoginModal() {
      this.showLoginModal = !this.showLoginModal;
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    goToAdminView() {
      this.$router.push({ name: "AdminHome" });
    },
    goToReservation() {
      this.$router.push({ name: "Reservation" });
    },
    goToMenu() {
      this.$router.push({ name: "Menu" });
    },
    goToHome() {
      this.$router.push({ name: "Home" });
    },
    async login() {
      const { username, password } = this.loginForm;

      if (!username || !password) {
        alert("Bitte Benutzername und Passwort eingeben.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost/reservation-api/login/Login.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          alert("Login erfolgreich");
          this.showLoginModal = false;
          this.$router.push({ name: "AdminHome" });
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Fehler bei der Anmeldung:", error);
        alert("Es gab ein Problem mit der Anmeldung.");
      }
    },
  },
};
</script>

<style scoped>
.restaurant-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  color: white;
  z-index: 2;
  backdrop-filter: blur(5px);
}

.menu-icon {
  cursor: pointer;
  font-size: 24px;
}

.login {
  margin-left: 20px;
}

button {
  background: none;
  border: 1px solid #e3b23c;
  color: #e3b23c;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s ease;
}

button:hover {
  background: #e3b23c;
  color: black;
}

.popdown-menu {
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  background-color: transparent;
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.popdown-menu button {
  background: none;
  border: 1px solid #e3b23c;
  color: #e3b23c;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s ease;
}

.popdown-menu button:hover {
  background: #e3b23c;
  color: black;
}

.login-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Halbtransparenter Hintergrund */
  display: flex;
  justify-content: center; /* Horizontal zentrieren */
  align-items: center; /* Vertikal zentrieren */
  z-index: 1000;
}

.login-modal-content {
  background-color: black;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px; /* Maximaler Wert für breite Bildschirme */
  position: relative;
  z-index: 1001;
  text-align: center;
  transition: all 0.3s ease;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.password-group {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

input[type="text"],
input[type="password"] {
  margin-top: 8px;
}

input[type="submit"] {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #c0392b;
}

/* Media Queries für unterschiedliche Bildschirmgrößen */
@media (max-width: 768px) {
  .login-modal-content {
    width: 90%; /* Für kleinere Bildschirme breiter machen */
  }
}

@media (max-width: 480px) {
  .login-modal-content {
    width: 95%; /* Für sehr kleine Bildschirme noch breiter */
    padding: 15px; /* Etwas weniger Innenabstand */
  }

  .form-group input {
    padding: 10px;
    font-size: 14px;
  }

  button {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}
</style>
