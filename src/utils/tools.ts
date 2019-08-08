export const dilateByK = (image: number[][], k: number) => {
    for (var i = 0; i < k; i++) {
        image = dilateByOne(image);
    }
    return image;
}

const dilateByOne = (image: number[][]) => {
    for (var i = 0; i < image.length; i++) {
        for (var j = 0; j < image[i].length; j++) {
            if (image[i][j] == 1) {
                if (i > 0 && image[i - 1][j] == 0) image[i - 1][j] = 2;
                if (j > 0 && image[i][j - 1] == 0) image[i][j - 1] = 2;
                if (i + 1 < image.length && image[i + 1][j] == 0) image[i + 1][j] = 2;
                if (j + 1 < image[i].length && image[i][j + 1] == 0) image[i][j + 1] = 2;
            }
        }
    }
    for (i = 0; i < image.length; i++) {
        for (j = 0; j < image[i].length; j++) {
            if (image[i][j] == 2) {
                image[i][j] = 1;
            }
        }
    }
    return image;
}