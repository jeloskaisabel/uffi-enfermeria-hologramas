<template>
  <div class="relative flex justify-center items-center h-screen bg-cover bg-center"
    :style="{ backgroundImage: `url(${require('@/assets/image-hero.png')})` }">
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    <div class="relative z-10 text-center text-white p-4 max-w-screen-lg mx-auto">
      <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">Bienvenido a la Sala de Hologramas de Anatomía I</h1>
      <p class="text-base md:text-lg lg:text-2xl mb-8"> Explora la colección de modelos holográficos diseñados para el
        estudio de anatomía en enfermería.
        Interactúa con estructuras en 3D para una comprensión profunda del cuerpo humano.</p>
      <button @click="scrollToContent"
        class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full">
        Empezar
      </button>
    </div>
  </div>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tecnología Educativa</h2>
        <p class="text-xl text-gray-600">
          El laboratorio de hologramas 3D ofrece una experiencia inmersiva para el estudio de anatomía,
          con modelos interactivos que preparan a los estudiantes para su práctica clínica.
        </p>
      </div>
    </div>
  </section>
  <section id="content" class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-gray-800">Explora Modelos 3D</h2>
      <div class="flex justify-end mb-6 space-x-4">
        <button @click="prevSlide"
          class="z-10 bg-white border-2 md:border-4 border-blue-800 shadow-md py-3 px-3 lg:px-6 hover:bg-blue-50 transition-colors focus:outline-none"
          aria-label="Anterior">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button @click="nextSlide"
          class="z-10 bg-white border-2 md:border-4 border-blue-800 shadow-md py-3 px-3 lg:px-6 hover:bg-blue-50 transition-colors focus:outline-none"
          aria-label="Siguiente">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div class="relative">
        <div class="overflow-hidden pb-4">
          <div class="flex transition-all duration-500 ease-in-out" 
            :class="{ 'transition-none': isTransitioning }"
            :style="{ 
              transform: `translateX(-${transformValue}%)`,
              opacity: fadeOpacity
            }">
            <div v-for="(model, index) in models" :key="index" class="min-w-full sm:min-w-1/2 lg:min-w-1/3 px-4">
              <div
                class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col transform hover:scale-105"
                style="min-height: 380px;">
                <div class="p-8 flex-grow">
                  <div class="flex items-center mb-6">
                    <h3 class="text-xl font-semibold text-blue-900">{{ model.title }}</h3>
                  </div>
                  <p class="text-lg text-blue-900 mb-4">{{ model.description }}</p>
                </div>
                <div class="px-8 pb-8">
                  <div class="flex justify-between items-center">
                    <router-link :to="'/visualizer/' + model.type"
                      class="font-medium transition-colors text-lg text-blue-900">
                      Ver modelos
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-8 space-x-2 sm:hidden">
      <button v-for="(_, index) in totalSlides" :key="index" @click="goToSlide(index)"
        :class="`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`"></button>
    </div>
  </section>


</template>

<script>
export default {
  name: 'HomeComponent',
  data() {
    return {
      currentIndex: 0,
      windowWidth: window.innerWidth,
      isTransitioning: false,
      navigationDirection: 'next',
      models: [
        {
          title: "Sistema Nervioso",
          description: "Modelos detallados del encéfalo, médula espinal y nervios periféricos para estudio neurológico.",
          type: "sistema-nervioso",
        },
        {
          title: "Cardiovascular",
          description: "Corazón, vasos sanguíneos y sistema circulatorio con enfoque en procedimientos de enfermería.",
          type: "cardiovascular"
        },
        {
          title: "Respiratorio",
          description: "Vías aéreas, pulmones y estructuras relacionadas para comprensión de la ventilación.",
          type: "sistema-respiratorio",
        },
        {
          title: "Digestivo",
          description: "Anatomía abdominal y órganos digestivos para procedimientos de alimentación y eliminación.",
          type: "sistema-digestivo"
        },
        {
          title: "Osteoarticular",
          description: "Esqueleto humano y articulaciones con puntos de referencia para procedimientos.",
          type: "osteoarticular"
        }
      ]
    }
  },
  computed: {
    cardsPerSlide() {
      if (this.windowWidth < 640) {
        return 1;
      } else if (this.windowWidth < 1024) {
        return 2;
      } else {
        return 3;
      }
    },
    totalSlides() {
      return Math.ceil(this.models.length / this.cardsPerSlide);
    },
    transformValue() {
      return this.currentIndex * 100;
    },
    fadeOpacity() {
      return this.isTransitioning ? 0 : 1;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
      const maxIndex = this.totalSlides - 1;
      if (this.currentIndex > maxIndex) {
        this.currentIndex = maxIndex;
      }
    },
    scrollToContent() {
      const contentSection = document.getElementById('content');
      if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
    prevSlide() {
      this.navigationDirection = 'prev';
      const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.totalSlides - 1;
      this.handleCircularTransition(newIndex);
    },
    nextSlide() {
      this.navigationDirection = 'next';
      const newIndex = this.currentIndex < this.totalSlides - 1 ? this.currentIndex + 1 : 0;
      this.handleCircularTransition(newIndex);
    },
    handleCircularTransition(newIndex) {
      const isCircular = ((this.currentIndex == this.totalSlides - 1 && newIndex == 0) || (this.currentIndex == 0 && newIndex == this.totalSlides - 1));

      if (isCircular) {
        this.isTransitioning = true;
        
        setTimeout(() => {
          this.currentIndex = newIndex;
          setTimeout(() => {
            this.isTransitioning = false;
          }, 100);
        }, 250);
      } else {
        this.isTransitioning = true;
        this.currentIndex = newIndex;
        
        setTimeout(() => {
          this.isTransitioning = false;
        }, 300);
      }
    },
    goToSlide(index) {
      this.currentIndex = index;
    }
  }
};
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.transition-none {
  transition: none !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.min-w-full {
  min-width: 100%;
}

@media (min-width: 640px) {
  .sm\:min-w-1\/2 {
    min-width: 50%;
  }
}

@media (min-width: 1024px) {
  .lg\:min-w-1\/3 {
    min-width: 33.333333%;
  }
}

@media (min-width: 1280px) {
  .xl\:min-w-1\/4 {
    min-width: 25%;
  }
}
</style>
