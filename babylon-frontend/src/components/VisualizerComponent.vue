<template>
  <div class="overflow-x-hidden">
    <div class="grid grid-cols-1 md:grid-cols-5 place-items-center py-3">
      <div class="md:col-span-4 w-full h-max md:ml-5">
        <DisplayBabylon :modelURL="modelURL" />
      </div>
      <div class="mr-2 w-full">
        <ListModels :type="visualizerType" @changemodel="changemodel" />
      </div>
    </div>
  </div>
</template>

<script>
import DisplayBabylon from './DisplayBabylon.vue';
import ListModels from './ListModels.vue';

export default {
  name: 'VisualizerComponent',
  components: {
    DisplayBabylon,
    ListModels,
  },
  props: ['type'],
  data() {
    return {
      modelURL: '',
      visualizerType: this.type,
      visualizerTitle: '',
    };
  },
  mounted() {
    this.updateTitleAndModel(this.type);
  },
  watch: {
    '$route.params.type': {
      immediate: true,
      handler(newType) {
        this.visualizerType = newType;
        this.updateTitleAndModel(newType);
      },
    },
  },
  methods: {
    changemodel(modelURL) {
      console.log('URL del modelo cambiada a:', modelURL); // Depuración
      this.modelURL = modelURL;
    },
    async updateTitleAndModel(type) {
      if (!type) return;

      this.visualizerTitle = this.capitalizeWords(type.replace(/-/g, ' '));
      console.log('Título actualizado:', this.visualizerTitle); // Depuración

      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}files`);
        const data = await response.json();
        console.log('Datos obtenidos para el título y modelo:', data); // Depuración

        const originalType = Object.keys(data).find(key => this.normalizeString(key) === type);
        console.log('Tipo original:', originalType); // Depuración

        if (data[originalType] && Object.keys(data[originalType]).length > 0) {
          const firstModel = Object.values(data[originalType])[0];
          console.log('Primera URL del modelo:', firstModel.modelURL); // Depuración
          this.modelURL = firstModel.modelURL;
        } else {
          this.modelURL = '';
        }
      } catch (error) {
        console.error('Error al obtener modelos:', error); // Depuración
      }
    },
    capitalizeWords(str) {
      return str.replace(/\b\w/g, (char) => char.toUpperCase());
    },
    normalizeString(str) {
      return str.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
  },
};
</script>

<style scoped>
/* Añade cualquier estilo adicional aquí */
</style>
