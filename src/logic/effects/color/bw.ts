import { Effect } from '../effect.ts';
import { CpuImage } from '../../image.ts';

export class GreyscaleFromRedEffect extends Effect {
    protected override applyCpu(image: CpuImage | null): CpuImage | null {
        const imageData = image?.getImageData();
        if (!imageData) return null;

        const pixelData = imageData.data.slice();
        for (let i = 0; i < pixelData.length; i += 4) {
            const r = pixelData[i];
            pixelData[i + 1] = r;
            pixelData[i + 2] = r;
        }

        const resultImageData = new ImageData(pixelData, imageData.width, imageData.height);
        return CpuImage.fromImageData(resultImageData);
    }
}

export class GreyscaleFromGreenEffect extends Effect {
    protected override applyCpu(image: CpuImage | null): CpuImage | null {
        const imageData = image?.getImageData();
        if (!imageData) return null;

        const pixelData = imageData.data.slice();
        for (let i = 0; i < pixelData.length; i += 4) {
            const g = pixelData[i + 1];
            pixelData[i    ] = g;
            pixelData[i + 2] = g;
        }

        const resultImageData = new ImageData(pixelData, imageData.width, imageData.height);
        return CpuImage.fromImageData(resultImageData);
    }
}

export class GreyscaleFromBlueEffect extends Effect {
    protected override applyCpu(image: CpuImage | null): CpuImage | null {
        const imageData = image?.getImageData();
        if (!imageData) return null;

        const pixelData = imageData.data.slice();
        for (let i = 0; i < pixelData.length; i += 4) {
            const b = pixelData[i + 2];
            pixelData[i    ] = b;
            pixelData[i + 1] = b;
        }

        const resultImageData = new ImageData(pixelData, imageData.width, imageData.height);
        return CpuImage.fromImageData(resultImageData);
    }
}

export class GreyscaleFromAverageEffect extends Effect {
    protected override applyCpu(image: CpuImage | null): CpuImage | null {
        const imageData = image?.getImageData();
        if (!imageData) return null;

        const pixelData = imageData.data.slice();
        for (let i = 0; i < pixelData.length; i += 4) {
            let avg = pixelData[i] + pixelData[i + 1] + pixelData[i + 2];
            avg /= 3;
            avg = Math.round(avg);

            pixelData[i    ] = avg;
            pixelData[i + 1] = avg;
            pixelData[i + 2] = avg;
        }

        const resultImageData = new ImageData(pixelData, imageData.width, imageData.height);
        return CpuImage.fromImageData(resultImageData);
    }
}

export class ThresholdEffect extends Effect {
    private readonly redThreshold: number;
    private readonly greenThreshold: number;
    private readonly blueThreshold: number;

    constructor(redThreshold: number, greenThreshold: number, blueThreshold: number) {
        super();

        this.redThreshold = redThreshold;
        this.greenThreshold = greenThreshold;
        this.blueThreshold = blueThreshold;
    }

    protected override applyCpu(image: CpuImage | null): CpuImage | null {
        const imageData = image?.getImageData();
        if (!imageData) return null;

        const pixelData = imageData.data.slice();
        for (let i = 0; i < pixelData.length; i += 4) {
            pixelData[i    ] = pixelData[i    ] >= this.redThreshold ? 0xff : 0;
            pixelData[i + 1] = pixelData[i + 1] >= this.greenThreshold ? 0xff : 0;
            pixelData[i + 2] = pixelData[i + 2] >= this.blueThreshold ? 0xff : 0;
        }

        const resultImageData = new ImageData(pixelData, imageData.width, imageData.height);
        return CpuImage.fromImageData(resultImageData);
    }
}
