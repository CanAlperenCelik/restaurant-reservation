import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";
import ReservationPage from "./components/ReservationPage.vue";
import ShopView from "./components/ShopView.vue";
import ErrorPage from "./components/ErrorPage.vue";
import OrdersAdmin from "./components/AdminView/OrdersAdmin.vue";
import AdminDashboard from "./components/AdminView/AdminDashboard.vue";
import ReservationAdmin from "./components/AdminView/ReservationAdmin.vue";
import AdminHome from "./components/AdminView/AdminHome.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/reservierung", name: "Reservation", component: ReservationPage },
  { path: "/:guid/menu", name: "Menu", component: ShopView },
  {
    path: "/admin",
    component: AdminDashboard, // Hauptkomponente für Admin-Bereich
    children: [
      { path: "", name: "AdminHome", component: AdminHome }, // Dies ist die korrekte Route
      {
        path: "reservations",
        name: "ReservationsAdmin",
        component: ReservationAdmin,
      },
      { path: "orders", name: "OrdersAdmin", component: OrdersAdmin },
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
