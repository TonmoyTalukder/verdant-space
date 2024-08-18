type SrcSetItem = {
    src: string;
    height: number;
    width: number;
};

type ImageItem = {
    src: string;
    height: number;
    width: number;
    srcSet: SrcSetItem[];
};

export const generateImagesArray = (imagePaths: string[]): ImageItem[] => {
    const variation1: SrcSetItem[] = [
        { src: "", height: 780, width: 1080 },
        { src: "", height: 462, width: 640 },
        { src: "", height: 277, width: 384 },
        { src: "", height: 185, width: 256 },
        { src: "", height: 92, width: 128 },
        { src: "", height: 69, width: 96 },
        { src: "", height: 46, width: 64 },
        { src: "", height: 35, width: 48 }
    ];

    const variation2: SrcSetItem[] = [
        { src: "", height: 1620, width: 1080 },
        { src: "", height: 960, width: 640 },
        { src: "", height: 576, width: 384 },
        { src: "", height: 384, width: 256 },
        { src: "", height: 192, width: 128 },
        { src: "", height: 144, width: 96 },
        { src: "", height: 96, width: 64 },
        { src: "", height: 72, width: 48 }
    ];

    const variation3: SrcSetItem[] = [
        { src: "", height: 607, width: 1080 },
        { src: "", height: 360, width: 640 },
        { src: "", height: 216, width: 384 },
        { src: "", height: 144, width: 256 },
        { src: "", height: 72, width: 128 },
        { src: "", height: 54, width: 96 },
        { src: "", height: 36, width: 64 },
        { src: "", height: 27, width: 48 }
    ];

    const variation4: SrcSetItem[] = [
        { src: "", height: 1549, width: 1080 },
        { src: "", height: 918, width: 640 },
        { src: "", height: 551, width: 384 },
        { src: "", height: 367, width: 256 },
        { src: "", height: 184, width: 128 },
        { src: "", height: 138, width: 96 },
        { src: "", height: 92, width: 64 },
        { src: "", height: 69, width: 48 }
    ];

    const variation5: SrcSetItem[] = [
        { src: "", height: 694, width: 1080 },
        { src: "", height: 411, width: 640 },
        { src: "", height: 247, width: 384 },
        { src: "", height: 165, width: 256 },
        { src: "", height: 82, width: 128 },
        { src: "", height: 62, width: 96 },
        { src: "", height: 41, width: 64 },
        { src: "", height: 31, width: 48 }
    ];

    const variation6: SrcSetItem[] = [
        { src: "", height: 1440, width: 1080 },
        { src: "", height: 853, width: 640 },
        { src: "", height: 512, width: 384 },
        { src: "", height: 341, width: 256 },
        { src: "", height: 171, width: 128 },
        { src: "", height: 128, width: 96 },
        { src: "", height: 85, width: 64 },
        { src: "", height: 64, width: 48 }
    ];

    const variations: SrcSetItem[][] = [
        variation1, // for image 1, 3, 4, 8, 10, 13
        variation2, // for image 2, 5, 12, 15
        variation3, // for image 6, 7
        variation4, // for image 9
        variation5, // for image 11
        variation6  // for image 14
    ];

    const imageMap: Record<number, number> = {
        1: 0, 3: 0, 4: 0, 8: 0, 10: 0, 13: 0, // variation1
        2: 1, 5: 1, 12: 1, 15: 1,               // variation2
        6: 2, 7: 2,                             // variation3
        9: 3,                                   // variation4
        11: 4,                                  // variation5
        14: 5                                   // variation6
    };

    const images: ImageItem[] = [];

    imagePaths.forEach((path, i) => {
        const index = ((i) % 15) + 1; // Normalize image index to 1-15 range
        const variationIndex = imageMap[index] !== undefined ? imageMap[index] : 0; // Fallback to variation 1 if index is not found
        const srcSet = variations[variationIndex];
        images.push({
            src: path,
            height: srcSet[0].height,
            width: srcSet[0].width,
            srcSet: srcSet.map(item => ({
                src: path,
                height: item.height,
                width: item.width
            }))
        });
    });

    return images;
};

// // Example usage:
// const photoPaths = [
//     'image1.png',
//     'image2.png',
//     'image3.png',
//     'image4.png',
//     'image5.png'
// ];

// const generatedPhotos = generateImagesArray(photoPaths);
// console.log(generatedPhotos);
