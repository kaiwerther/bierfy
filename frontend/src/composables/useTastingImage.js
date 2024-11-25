import { ref } from 'vue';
import api from '../api';

export function useTastingImage(tasting) {
  const imageUrl = ref(null);

  const loadImage = async () => {
    try {
      if (tasting.hasImage) {
        const response = await api.getTastingImageById(tasting.id, {
          responseType: 'blob',
        });
        const url = URL.createObjectURL(response.data);
        imageUrl.value = url;
      } else {
        imageUrl.value = null;
      }
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  return { imageUrl, loadImage };
}
