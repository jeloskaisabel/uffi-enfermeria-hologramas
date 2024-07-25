<template>
  <div class="h-[27rem] md:h-[43rem] py-5 max-h-screen overflow-y-auto overflow-x-hidden flex flex-col flex-grow">
    <div v-for="(modelData, name) in models" :key="name" class="flex justify-center mb-3">
      <button
        type="button"
        class="w-full max-w-xs focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-orange-900"
        @click="$emit('changemodel', modelData.modelURL)"
      >
        {{ name }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListModels',
  props: ['type'],
  data() {
    return {
      models: {},
    };
  },
  mounted() {
    this.getModels(this.type);
  },
  watch: {
    type: {
      immediate: true,
      handler(newType) {
        this.getModels(newType);
      },
    },
  },
  methods: {
    async getModels(type) {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}files`);
        const data = await response.json();
        console.log('Datos obtenidos:', data); // Depuración

        const originalType = Object.keys(data).find(key => this.normalizeString(key) === type);
        console.log('Tipo original:', originalType); // Depuración

        if (originalType) {
          this.models = data[originalType];
        } else {
          this.models = {};
        }
        console.log('Modelos para el tipo:', this.models); // Depuración
      } catch (error) {
        console.error('Error al obtener modelos:', error); // Depuración
      }
    },
    normalizeString(str) {
      return str.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
  },
};
</script>

<style scoped>
.area {
  justify-content: center;
  background-color: white;
  margin: 5px;
  border-radius: 12px;
}
</style>
