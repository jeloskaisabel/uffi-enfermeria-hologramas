<template>
  <div class="py-5 flex flex-col flex-grow">
    <div v-for="(child, systemKey) in models" :key="systemKey" class="border-b border-slate-200">
      <button @click="toggleSystem(systemKey)"
        class="w-full flex justify-between items-center py-3 text-white bg-orange-500 hover:bg-orange-600 font-medium px-4">
        <span>{{ child.originalName }}</span>
        <span class="transition-transform duration-300" :class="{ 'rotate-180': expandedSystems[systemKey] }">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-4 h-4">
            <path v-if="!expandedSystems[systemKey]"
              d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            <path v-else d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
          </svg>
        </span>
      </button>
      <div v-show="expandedSystems[systemKey]" class="mt-2 transition-all duration-300 ease-in-out">
        <div v-for="(model, modelKey) in child.children" :key="modelKey" class="mb-2">
          <div class="w-full">
            <button @click="$emit('changemodel', model.modelURL)"
              class="w-full text-white bg-orange-300 hover:bg-orange-400 font-medium py-2.5">
              {{ model.originalName }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  type: { type: String, required: true }
});
const emit = defineEmits(['changemodel', 'modelsLoaded']);
const models = ref({});
const expandedSystems = ref({});
watch(
  () => props.type,
  (newType) => getModels(newType),
  { immediate: true }
);
onMounted(() => {
  getModels(props.type);
});
async function getModels(type) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/models/${type}`);
    const data = await response.json();

    const normalizedType = normalizeString(data.originalName);

    if (normalizedType === type) {
      models.value = data.children || {};
      emit('modelsLoaded', models.value);
    } else {
      models.value = {};
      console.warn(`Normalized type "${normalizedType}" did not match prop type "${type}"`);
    }
    expandedSystems.value = Object.keys(models.value).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching models:', error);
  }
}

function normalizeString(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function toggleSystem(systemKey) {
  Object.keys(expandedSystems.value).forEach((key) => {
    if (key !== systemKey) expandedSystems.value[key] = false;
  });
  expandedSystems.value[systemKey] = !expandedSystems.value[systemKey];
}
</script>


<style scoped>
[v-cloak]>* {
  display: none;
}
</style>
