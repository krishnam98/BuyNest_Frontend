import { v4 as uuidv4 } from "uuid";
export default function getCroppedImage(imageSrc, croppedAreaPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], uuidv4() + ".jpeg", {
          type: "image/jpeg",
        });
        resolve(file);
      }, "image/jpeg");
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
}
