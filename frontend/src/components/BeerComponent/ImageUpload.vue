<template>
  <div class="card">
    <div class="card-body">
      <!-- Upload Buttons -->
      <div v-if="!imageData" class="text-center">
        <!-- Take Photo Button (Visible only on Mobile) -->
        <button
          type="button"
          class="btn btn-primary btn-lg d-md-none me-2"
          for="cameraInput"
        >
          <font-awesome-icon icon="camera" class="me-2" /> Take Photo
        </button>
        <input
          id="cameraInput"
          type="file"
          accept="image/*"
          capture="environment"
          class="d-none"
          @change="onFileChange"
        />

        <!-- Choose from Files Button (Visible on All Devices) -->
        <label class="btn btn-secondary btn-lg" for="fileInput">
          <font-awesome-icon icon="upload" class="me-2" /> Choose from Files
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          class="d-none"
          @change="onFileChange"
        />
      </div>

      <!-- Cropping Interface -->
      <div v-if="imageData" class="mt-4">
        <div class="row">
          <!-- Cropper Section -->
          <div class="col-12 col-md-8 mb-4">
            <div class="cropper-wrapper">
              <Cropper
                ref="cropper"
                :src="imageData"
                :aspect-ratio="1"
                :view-mode="1"
                :auto-crop-area="1"
                :responsive="true"
                :check-cross-origin="false"
                :background="false"
                :zoom-on-wheel="true"
                :wheel-zoom-ratio="0.1"
                style="width: 100%; max-height: 400px"
                @crop="onCrop"
                @cropend="onCropEnd"
                @zoom="onZoom"
              />
            </div>
          </div>

          <!-- Preview Section -->
          <div class="col-12 col-md-4">
            <h5 class="mb-3">Preview:</h5>
            <div v-if="croppedImage" class="preview-container">
              <img
                :src="croppedImage"
                alt="Cropped Image"
                class="img-fluid rounded shadow-sm"
              />
            </div>
            <div v-else class="text-muted">
              <i class="fas fa-image fa-2x"></i>
              <p class="mt-2">Cropped image preview will appear here.</p>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="text-center mt-4">
          <button class="btn btn-secondary" @click="resetImage">
            <i class="fas fa-redo me-2"></i> Choose Another
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-if="isLoading" class="text-center my-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Uploading...</span>
        </div>
        <p class="mt-2">Uploading...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Cropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { useToast } from 'vue-toastification';
const toast = useToast();

// Reactive References
const cropper = ref(null);
const imageData = ref(null);
const croppedImage = ref(null);
const isLoading = ref(false);

// Define Emits
const emit = defineEmits(['image-changed']);

// Define Zoom Constraints
const MIN_ZOOM = 1; // Minimum zoom level
const MAX_ZOOM = 3; // Maximum zoom level
let currentZoom = 1;

// Handle File Input Change
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageData.value = e.target.result;
      croppedImage.value = null; // Reset cropped image
      currentZoom = 1; // Reset zoom level
      if (cropper.value && cropper.value.cropper) {
        cropper.value.cropper.reset(); // Reset Cropper to initial state
      }
    };
    reader.readAsDataURL(file);
  } else {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.', { duration: 3000 });
    }
  }
};

// Crop the Image and Emit
const cropAndEmit = () => {
  if (cropper.value && cropper.value.cropper) {
    const canvas = cropper.value.cropper.getCroppedCanvas({
      width: 300,
      height: 300,
      imageSmoothingQuality: 'high',
    });
    const dataUrl = canvas.toDataURL('image/png');
    croppedImage.value = dataUrl;

    // Emit the cropped image to the parent component
    emitCroppedImage(dataUrl);
  }
};
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// Throttled Version of Crop Function
const debounceCropAndEmit = debounce(cropAndEmit, 50); // Adjust delay as needed

// Handle Crop Event
const onCrop = () => {
  debounceCropAndEmit();
};

const onCropEnd = () => {
  cropAndEmit();
};

// Handle Zoom Event
const onZoom = (event) => {
  // Update current zoom level
  currentZoom += event.detail.delta;

  // Clamp the zoom level within defined limits
  if (currentZoom < MIN_ZOOM) {
    currentZoom = MIN_ZOOM;
    cropper.value.cropper.zoomTo(currentZoom);
  } else if (currentZoom > MAX_ZOOM) {
    currentZoom = MAX_ZOOM;
    cropper.value.cropper.zoomTo(currentZoom);
  }
};

// Reset Image Selection
const resetImage = () => {
  imageData.value = null;
  croppedImage.value = null;
  currentZoom = 1;
};

// Emit Cropped Image to Parent
const emitCroppedImage = (dataUrl) => {
  emit('image-changed', dataUrl);
};
</script>

<style scoped>
.cropper-wrapper {
  width: 100%;
  height: 100%;
}

.preview-container {
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative;
}

.preview-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
