<template>
  <div class="relative flex justify-center items-center h-screen bg-cover bg-center" :style="{ backgroundImage: `url(${require('@/assets/image-hero.png')})` }">
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    <div class="relative z-10 text-center text-white p-4 max-w-screen-lg mx-auto">
      <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">Bienvenido a la Sala de Hologramas de Anatomía I</h1>
      <p class="text-base md:text-lg lg:text-2xl mb-8">Explora modelos anatómicos en 3D y sumérgete en una experiencia de aprendizaje interactiva.</p>
      <button @click="scrollToContent" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full">
        Empezar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeComponent',
  methods: {
    scrollToContent() {
      const contentSection = document.getElementById('content');
      if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
};
</script>

<style scoped>
h1 span {
  color: #FB9B50;
}
</style>
