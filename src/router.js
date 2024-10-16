import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";
import ReservationPage from "./components/ReservationPage.vue";
import ShopView from "./components/ShopView.vue";
import ErrorPage from "./components/ErrorPage.vue";
import OrdersAdmin from "./components/OrdersAdmin.vue";
import AdminDashboard from "./components/AdminDashboard.vue";
import ReservationAdmin from "./components/ReservationAdmin.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/reservierung", name: "Reservation", component: ReservationPage },
  { path: "/:guid/menu", name: "Menu", component: ShopView },
  {
    path: "/admin",
    name: "AdminDashboard", // Route für das Admin-Dashboard
    component: AdminDashboard,
    children: [
      {
        path: "reservations", // Unterseite für Reservierungen
        name: "ReservationsAdmin",
        component: ReservationAdmin,
      },
      {
        path: "orders", // Unterseite für Bestellungen
        name: "OrdersAdmin",
        component: OrdersAdmin,
      },
    ],
  },
  { path: "/error-page", name: "ErrorPage", component: ErrorPage },
  { path: "/:pathMatch(.*)*", redirect: "/error-page" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
