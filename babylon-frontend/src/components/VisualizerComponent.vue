<template>
  <div class="overflow-x-hidden w-full h-full px-5">
    <div class="grid grid-cols-1 md:grid-cols-5">
      <div class="md:col-span-4 w-full h-full">
        <DisplayBabylon :modelURL="modelURL" />
      </div>
      <div class="md:col-span-1 w-full h-full mr-2">
        <ListModels :type="visualizerType" @changemodel="changemodel" @modelsLoaded="setFirstModel" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DisplayBabylon from './DisplayBabylon.vue';
import ListModels from './ListModels.vue';

const props = defineProps({
  type: { type: String, required: true }
});

const modelURL = ref('');
const visualizerType = ref(props.type);
const visualizerTitle = ref('');

const route = useRoute();
watch(
  () => route.params.type,
  (newType) => {
    if (newType) {
      visualizerType.value = newType;
      updateTitle(newType);
    }
  },
  { immediate: true }
);
onMounted(() => {
  updateTitle(props.type);
});
function changemodel(url) {
  modelURL.value = url;
}

function updateTitle(type) {
  if (!type) return;
  visualizerTitle.value = capitalizeWords(type.replace(/-/g, ' '));
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

function setFirstModel(models) {
  const firstSystem = Object.values(models)[0];
  if (firstSystem && firstSystem.children?.length > 0) {
    modelURL.value = firstSystem.children[0].modelURL;
  }
}
</script>