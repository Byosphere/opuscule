export const dilateByK = (map: number[][], k: number, range?: number[]) => {
    let max = range ? k + getLargestNumber(range) : k;
    let val = 1;
    for (let i = 0; i < max; i++) {
        map = dilateByOne(map, val, val + 1);
        val++;
    }

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] <= k + 1 && map[i][j] > 0) {
                map[i][j] = 1;
            } else if (map[i][j] !== 20) {
                let val = 0;
                if (range) {
                    range.forEach((n: number) => {
                        if (map[i][j] === k + n + 1) val = 2;
                    });
                }
                map[i][j] = val;
            }
        }
    }

    return map;
}

const dilateByOne = (map: number[][], origin: number, val: number) => {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            if (map[i][j] == origin) {
                if (i > 0 && map[i - 1][j] == 0) map[i - 1][j] = 254878;
                if (j > 0 && map[i][j - 1] == 0) map[i][j - 1] = 254878;
                if (i + 1 < map.length && map[i + 1][j] == 0) map[i + 1][j] = 254878;
                if (j + 1 < map[i].length && map[i][j + 1] == 0) map[i][j + 1] = 254878;
            }
        }
    }
    for (i = 0; i < map.length; i++) {
        for (j = 0; j < map[i].length; j++) {
            if (map[i][j] == 254878) {
                map[i][j] = val || 1;
            }
        }
    }
    return map;
}

const getLargestNumber = (array: number[]) => {
    let max = array[0];
    array.forEach((n: number) => {
        if (n > max) max = n;
    });
    return max;
}