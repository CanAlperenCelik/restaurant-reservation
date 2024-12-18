import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";
import ReservationPage from "./components/ReservationPage.vue";
import ShopView from "./components/ShopView.vue";
import ErrorPage from "./components/ErrorPage.vue";
import OrdersAdmin from "./components/AdminView/OrdersAdmin.vue";
import AdminDashboard from "./components/AdminView/AdminDashboard.vue";
import ReservationAdmin from "./components/AdminView/ReservationAdmin.vue";
import AdminHome from "./components/AdminView/AdminHome.vue";
import TableView from "./components/AdminView/TableView.vue";
import ThankYouPage from "./components/ThankYouPage.vue";
import ShopCard from "./components/ShopCard.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/reservierung", name: "Reservation", component: ReservationPage },
  { path: "/speisekarte", name: "MenuCard", component: ShopCard },
  { path: "/:reservation_code/menu", name: "Menu", component: ShopView },
  {
    path: "/admin",
    component: AdminDashboard, // Hauptkomponente für Admin-Bereich
    children: [
      { path: "", name: "AdminHome", component: AdminHome },
      {
        path: "reservations",
        name: "ReservationsAdmin",
        component: ReservationAdmin,
      },
      { path: "orders", name: "OrdersAdmin", component: OrdersAdmin },
      {
        path: "table-view",
        name: "TableView",
        component: TableView,
      },
    ],
  },
  { path: "/thank-you", name: "ThankYouPage", component: ThankYouPage },
  { path: "/error-page", name: "ErrorPage", component: ErrorPage },
  { path: "/:pathMatch(.*)*", redirect: "/error-page" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
