import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
import { generateImagesArray } from "./generateImagesArray";
import { useEffect, useState } from "react";
import { photoPaths } from "./photos";

const getRandomImages = (array: string[], num: number): string[] => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const MosaicImgGallery = () => {
  const [photos, setPhotos] = useState(generateImagesArray(photoPaths));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // For mobile view, randomly select 6 images
        const selectedImages = getRandomImages(photoPaths, 6);
        setPhotos(generateImagesArray(selectedImages));
      } else {
        // For larger screens, use all images
        setPhotos(generateImagesArray(photoPaths));
      }
    };

    // Run on initial load
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div style={{ border: "2px", borderRadius: "12px", overflow: "hidden" }}>
      <PhotoAlbum layout="rows" photos={photos} targetRowHeight={150} />
    </div>
  );
};

export default MosaicImgGallery;
