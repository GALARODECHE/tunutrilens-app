/**
 * Processes and compresses an image (File or base64 data URL) to ensure fast,
 * reliable uploads to Gemini API without memory or payload overflow errors.
 */
export async function processAndCompressImage(
  fileOrDataUrl: File | string,
  maxDimension = 1200,
  quality = 0.85
): Promise<{ dataUrl: string; base64: string; mimeType: string }> {
  const compressionPromise = new Promise<{ dataUrl: string; base64: string; mimeType: string }>((resolve, reject) => {
    const img = new Image();

    const handleLoad = () => {
      try {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Fill background white to handle transparent PNGs nicely
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const base64 = dataUrl.split(',')[1] || '';

        resolve({ dataUrl, base64, mimeType });
      } catch (err) {
        reject(err);
      }
    };

    img.onload = handleLoad;
    img.onerror = () => reject(new Error('Error al cargar la imagen para procesamiento'));

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Error al leer el archivo de imagen'));
        }
      };
      reader.onerror = () => reject(new Error('Error en FileReader'));
      reader.readAsDataURL(fileOrDataUrl);
    }
  });

  // 3.5-second safety timeout so photo processing can never hang
  const timeoutPromise = new Promise<{ dataUrl: string; base64: string; mimeType: string }>((resolve) => {
    setTimeout(() => {
      if (typeof fileOrDataUrl === 'string') {
        const base64 = fileOrDataUrl.split(',')[1] || '';
        resolve({ dataUrl: fileOrDataUrl, base64, mimeType: 'image/jpeg' });
      } else {
        // As a last fallback, return a basic placeholder
        resolve({ dataUrl: '', base64: '', mimeType: 'image/jpeg' });
      }
    }, 3500);
  });

  return Promise.race([compressionPromise, timeoutPromise]);
}
