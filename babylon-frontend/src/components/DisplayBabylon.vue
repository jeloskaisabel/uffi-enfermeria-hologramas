<template>
  <div class="md:mr-10 overflow-auto py-5" id="cnvid">
    <canvas ref="canvas" class="w-full max-h-[40rem]" />
    <div>
      <button class="bg-blue-800 text-white px-5 py-1 mt-2 rounded-full" @click="toggleFullScreen" id="view-fullscreen">
        Pantalla completa
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/core/Loading/loadingScreen';

const props = defineProps({
  modelURL: { type: String, required: false, default: '' }
});

const canvas = ref(null);
const engine = ref(null);
const scene = ref(null);
const camera = ref(null);

watch(() => props.modelURL, () => {
  if (props.modelURL) {
    dispose();
    initEngineAndScene();
  } else {
    dispose();
    initEmptyScene();
  }
});

onMounted(() => {
  if (props.modelURL) {
    initEngineAndScene();
  } else {
    initEmptyScene();
  }
});

onBeforeUnmount(dispose);

async function initEngineAndScene() {
  if (!props.modelURL) {
    console.warn('No model URL provided');
    return;
  }

  if (!canvas.value) {
    console.error('Canvas element not available');
    return;
  }

  try {
    const fullURL = `${import.meta.env.VITE_API_URL}/${props.modelURL}`;
    engine.value = new BABYLON.Engine(canvas.value, true, {
      preserveDrawingBuffer: true,
      stencil: true
    });

    scene.value = await createScene(fullURL);

    window.addEventListener('resize', handleResize);

    engine.value.runRenderLoop(() => {
      if (scene.value && scene.value.activeCamera) {
        scene.value.render();
      }
    });

  } catch (error) {
    console.error('Error initializing Babylon scene:', error);
  }
}

async function initEmptyScene() {
  if (!canvas.value) {
    console.error('Canvas element not available');
    return;
  }

  try {
    engine.value = new BABYLON.Engine(canvas.value, true, {
      preserveDrawingBuffer: true,
      stencil: true
    });

    scene.value = await createEmptyScene();

    window.addEventListener('resize', handleResize);

    engine.value.runRenderLoop(() => {
      if (scene.value && scene.value.activeCamera) {
        scene.value.render();
      }
    });

  } catch (error) {
    console.error('Error initializing empty Babylon scene:', error);
  }
}

async function createScene(modelURL) {
  const newScene = new BABYLON.Scene(engine.value);
  newScene.clearColor = new BABYLON.Color3(0, 0, 0);

  const newCamera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2,
    2,
    BABYLON.Vector3.Zero(),
    newScene
  );

  newCamera.attachControl(canvas.value, true);
  newCamera.wheelPrecision = 15;
  newCamera.pinchDeltaPercentage *= -1;
  newCamera.pinchPrecision = 75;

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    newScene
  );

  newScene.registerBeforeRender(() => {
    light.position = newCamera.position;
  });

  await loadModel(newScene, newCamera, modelURL);

  camera.value = newCamera;
  return newScene;
}

async function createEmptyScene() {
  const newScene = new BABYLON.Scene(engine.value);
  newScene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  const newCamera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2,
    5,
    BABYLON.Vector3.Zero(),
    newScene
  );

  newCamera.attachControl(canvas.value, true);
  newCamera.wheelPrecision = 15;
  newCamera.pinchDeltaPercentage *= -1;
  newCamera.pinchPrecision = 75;
  newCamera.lowerRadiusLimit = 1;
  newCamera.upperRadiusLimit = 50;

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    newScene
  );

  newScene.registerBeforeRender(() => {
    light.position = newCamera.position;
  });

  camera.value = newCamera;
  return newScene;
}

async function loadModel(sceneInstance, cameraInstance, modelURL) {
  try {
    engine.value.displayLoadingUI();
    const result = await BABYLON.SceneLoader.LoadAssetContainerAsync(
      "",
      modelURL,
      sceneInstance
    );
    result.addAllToScene();

    if (result.meshes.length === 0) {
      console.warn("No meshes found in the loaded model.");
      return;
    }

    let mainMesh = result.meshes[0];
    mainMesh = result.meshes.find(mesh => mesh.name !== "__root__")

    const boundingInfo = mainMesh.getBoundingInfo();
    const size = boundingInfo.diagonalLength;
    if (size < 1) {
      const scaleFactor = 1 / size;
      result.meshes.forEach(mesh => {
        mesh.scaling.scaleInPlace(scaleFactor);
      });
    }

    const adjustedSize = Math.max(size, 1);
    cameraInstance.radius = adjustedSize * 2;
    cameraInstance.lowerRadiusLimit = adjustedSize * 0.5;
    cameraInstance.upperRadiusLimit = adjustedSize * 10;
    cameraInstance.target = boundingInfo.boundingBox.centerWorld;

  } catch (err) {
    console.error('Error loading model:', err);
  } finally {
    engine.value.hideLoadingUI();
  }
}

function handleResize() {
  engine.value?.resize();
}

function dispose() {
  if (scene.value) {
    scene.value.dispose();
    scene.value = null;
  }
  if (engine.value) {
    engine.value.dispose();
    engine.value = null;
  }
  window.removeEventListener('resize', handleResize);
}

function toggleFullScreen() {
  if (!canvas.value) return;

  const c = canvas.value;
  const requestFullscreen =
    c.requestFullscreen ||
    c.webkitRequestFullScreen ||
    c.mozRequestFullScreen ||
    c.msRequestFullscreen ||
    c.webkitEnterFullscreen;

  if (requestFullscreen) {
    requestFullscreen.call(c);
  }
}
</script>

<style scoped>
#cnvid {
  margin-top: 0;
}

canvas {
  display: block;
}
</style>