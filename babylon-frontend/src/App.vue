<template>
  <div>
    <nav class="bg-white border-b py-2 px-2 border-gray-200">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="./assets/set-logo.png" class="h-16 hidden md:block" alt="Logo Enfermeria" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap text-blue-800">Carrera de Enfermería</span>
        </router-link>
        <button @click="toggleNavbar" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-multi-level" :aria-expanded="navbarOpen">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
        <div :class="['w-full md:block md:w-auto', { hidden: !navbarOpen }]" id="navbar-multi-level">
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <router-link to="/" class="block py-2 px-3 text-blue-800 hover:text-orange-500 md:p-0">Inicio</router-link>
            </li>
            <li class="relative">
              <div @click="toggleDropdown" class="block py-2 px-3 text-blue-800 cursor-pointer hover:text-orange-500 md:p-0">
                Modelos 3D
                <svg class="w-2.5 h-2.5 inline ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
              </div>
              <div v-if="dropdownOpen" class="absolute bg-white border border-gray-100 rounded-lg shadow-md mt-2">
                <ul class="py-2 text-sm text-gray-700">
                  <li v-for="type in types" :key="type.original">
                    <router-link @click="closeDropdown" :to="{ name: 'Visualizer', params: { type: type.formatted } }" class="block px-4 py-2 hover:bg-gray-100">
                      {{ capitalizeWords(type.original) }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      navbarOpen: false,
      dropdownOpen: false,
      types: []
    };
  },
  mounted() {
    this.fetchTypes();
  },
  methods: {
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    async fetchTypes() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}files`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('Fetched types:', data); // Debug: ver los datos que se han obtenido
        this.types = Object.keys(data).map(key => ({
          original: key,
          formatted: encodeURIComponent(key.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        }));
        console.log('Processed types:', this.types); // Debug: ver los datos procesados
      } catch (error) {
        console.error('Failed to fetch types:', error);
      }
    },
    capitalizeWords(str) {
      return str.replace(/\b\w/g, char => char.toUpperCase());
    }
  }
};
</script>

<style scoped>
nav {
  position: relative;
  z-index: 10;
}
</style>
