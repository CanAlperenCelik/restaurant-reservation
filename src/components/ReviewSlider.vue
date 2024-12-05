<template>
  <div class="reviews-wrapper">
    <div class="review-container" ref="reviewsContainer">
      <div class="reviews">
        <!-- 5 Customer Reviews -->
        <div class="review" v-for="(review, index) in reviews" :key="index">
          <h3>{{ review.name }}</h3>
          <div class="stars">
            {{ "★".repeat(review.rating) }}{{ "☆".repeat(5 - review.rating) }}
          </div>
          <p>{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reviews: [
        {
          name: "Max Mustermann",
          rating: 5,
          comment:
            "Ein großartiger Service! Ich bin sehr zufrieden mit meinem Kauf und werde definitiv wiederkommen.",
        },
        {
          name: "Maria Müller",
          rating: 4,
          comment:
            "Die Qualität des Produkts ist gut, aber der Versand hat etwas länger gedauert als erwartet.",
        },
        {
          name: "Peter Schmidt",
          rating: 5,
          comment:
            "Absolut empfehlenswert! Alles war perfekt – von der Bestellung bis zur Lieferung.",
        },
        {
          name: "Laura Becker",
          rating: 3,
          comment:
            "Das Produkt ist in Ordnung, aber ich hatte etwas mehr erwartet. Der Kundenservice könnte besser sein.",
        },
        {
          name: "Tim Hoffmann",
          rating: 4,
          comment:
            "Gutes Preis-Leistungs-Verhältnis. Ich bin zufrieden mit dem Kauf, jedoch gab es kleinere Mängel bei der Verpackung.",
        },
      ],
    };
  },
  mounted() {
    this.cloneReviews();
  },
  methods: {
    cloneReviews() {
      const reviewsContainer = this.$refs.reviewsContainer;
      const reviewsClone = reviewsContainer.innerHTML;
      reviewsContainer.innerHTML += reviewsClone;
    },
  },
};
</script>

<style scoped>
.reviews-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 45px auto;
  padding: 10px;
  overflow: hidden; /* Verhindert, dass der Inhalt außerhalb des Blocks angezeigt wird */
  border: 2px solid #e3b23c; /* Gelbe Umrandung */
  border-radius: 10px;
}

.review-container {
  display: flex;
  width: max-content; /* Maximiert die Breite des Containers je nach Inhalt */
  animation: scroll 150s linear infinite; /* Animation läuft konstant */
}

.reviews {
  display: flex;
}

.review {
  background-color: #000000; /* Dunkler Hintergrund für jede Bewertung */
  border: 1px solid #e3b23c; /* Gelbe Umrandung für jede Bewertung */
  margin: 0 20px;
  padding: 20px;
  width: 300px; /* Weite der Bewertung */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0);
}

.review h3 {
  font-size: 18px;
  margin: 0 0 10px;
}

.stars {
  color: #e3b23c; /* Gelbe Farbe für die Sterne */
  margin-bottom: 10px;
}

.review p {
  font-size: 14px;
  color: #e3b23c; /* Gelbe Schriftfarbe */
  line-height: 1.6;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Stoppen der Animation beim Hover */
.review-container:hover {
  animation-play-state: paused; /* Stoppt die Animation */
}
</style>
