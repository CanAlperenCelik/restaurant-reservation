<template>
  <header class="restaurant-header" style="background-color: transparent">
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
      <button @click="goToMenu">Menu</button>
      <button @click="goToReservation">Reservation</button>
    </div>

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
  </header>
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
      fixedUsername: "Can",
      fixedPassword: "1905Can",
    };
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
      this.$router
        .push({ name: "AdminHome" }) // Hier sicherstellen, dass 'AdminHome' existiert
        .then(() => {
          console.log("Navigation success");
        })
        .catch((err) => {
          console.error("Navigation error:", err);
        });
    },
    goToReservation() {
      this.$router.push({ name: "Reservation" });
    },
    goToMenu() {
      this.$router.push({ name: "Menu" });
    },
    login() {
      // Dein Login-Code hier...
      this.goToAdminView(); // Stelle sicher, dass dieser Aufruf nach einem erfolgreichen Login erfolgt
    },
  },
};
</script>

<style scoped>
.restaurant-header {
  position: absolute; /* Über dem Video platzieren */
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4); /* Transparenter Hintergrund */
  color: white;
  z-index: 2; /* Höher als das Video */
  backdrop-filter: blur(5px); /* Optional: Unschärfe für besseren Kontrast */
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-modal-content {
  margin-top: 35%;
  background-color: black;
  padding: 40px;
  border-radius: 8px;
  width: 20%;
  position: relative;
  z-index: 1001;
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
</style>
