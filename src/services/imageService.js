// src/services/imageService.js

// 💡 Remplacez par votre vraie clé API ImgBB
const IMGBB_API_KEY = '35bb74e2910fc59f0f0e4e2ad6c87935'; 

export const uploadImageToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      // Retourne l'URL de l'image hébergée
      return data.data.url; 
    } else {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }
  } catch (error) {
    console.error('Erreur API ImgBB:', error);
    throw error;
  }
};