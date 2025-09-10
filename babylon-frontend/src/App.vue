<template>
  <div class="flex flex-col h-screen overflow-auto">
    <nav class="bg-white border-b py-2 px-2 border-gray-200 relative z-10">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/images/set-logo.png" class="h-16 hidden md:block" alt="Logo Enfermería" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap text-blue-800">
            Carrera de Enfermería
          </span>
        </router-link>

        <button @click="toggleNavbar"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          :aria-expanded="navbarOpen">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" fill="none" viewBox="0 0 17 14" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        <div :class="['w-full md:block md:w-auto', { hidden: !navbarOpen }]">
          <ul
            class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white md:flex-row md:space-x-8 md:mt-0 md:border-0">
            <li>
              <router-link to="/"
                class="block py-2 px-3 text-blue-800 hover:text-orange-500 md:p-0">Inicio</router-link>
            </li>

            <li class="relative" v-if="types.length > 0">
              <div @click="toggleDropdown"
                class="block py-2 px-3 text-blue-800 cursor-pointer hover:text-orange-500 md:p-0 select-none">
                Modelos 3D
                <svg class="w-2.5 h-2.5 inline ml-1" fill="none" viewBox="0 0 10 6" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                </svg>
              </div>

              <div v-show="dropdownOpen"
                class="absolute bg-white border border-gray-100 rounded-lg shadow-md mt-2 min-w-[150px] z-20">
                <ul class="py-2 text-sm text-gray-700">
                  <li v-for="type in types" :key="type.fixedName">
                    <router-link :to="{ name: 'Visualizer', params: { type: type.fixedName } }"
                      @click.native="closeDropdown" class="block px-4 py-2 hover:bg-gray-100">
                      {{ capitalizeWords(type.originalName) }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>

          </ul>
        </div>
      </div>
    </nav>

    <div class="flex-grow">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const navbarOpen = ref(false);
const dropdownOpen = ref(false);
const types = ref([]);

const toggleNavbar = () => (navbarOpen.value = !navbarOpen.value);
const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value);
const closeDropdown = () => (dropdownOpen.value = false);

const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const fetchTypes = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${apiUrl}/api/categories`);
    types.value = response.data || [];
  } catch (error) {
    console.error('Failed to fetch types:', error);
  }
};

onMounted(() => {
  fetchTypes();
});
</script>

<style scoped>
nav {
  position: relative;
  z-index: 10;
}
</style>
