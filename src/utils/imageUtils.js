export function resizeImageFile(file, maxSize = 800, quality = 0.88) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const ratio   = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const targetW = Math.round(img.width  * ratio);
        const targetH = Math.round(img.height * ratio);

        /*
         * Stepped downscaling: halve dimensions iteratively while the
         * current size is more than 2× the target. A single large-step
         * reduction (e.g. 4032 → 800 px) uses the browser's low-quality
         * interpolation and produces visible pixelation; halving each time
         * stays in the high-quality range at every step.
         */
        let src  = img;
        let srcW = img.width;
        let srcH = img.height;

        while (srcW > targetW * 2 || srcH > targetH * 2) {
          const stepW = Math.max(Math.round(srcW / 2), targetW);
          const stepH = Math.max(Math.round(srcH / 2), targetH);
          const step  = document.createElement('canvas');
          step.width  = stepW;
          step.height = stepH;
          const ctx = step.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(src, 0, 0, stepW, stepH);
          src  = step;
          srcW = stepW;
          srcH = stepH;
        }

        /* Final pass at exact target dimensions */
        const canvas = document.createElement('canvas');
        canvas.width  = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(src, 0, 0, targetW, targetH);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
