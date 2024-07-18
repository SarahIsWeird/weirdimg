import { CpuImage } from '../../image.ts';
import { Effect } from '../effect.ts';

export class ChannelSelectionEffect extends Effect {
    private readonly takeRed: boolean;
    private readonly takeGreen: boolean;
    private readonly takeBlue: boolean;

    constructor(takeRed: boolean = true,
                takeGreen: boolean = true,
                takeBlue: boolean = true,
                ) {
        super();

        this.takeRed = takeRed;
        this.takeGreen = takeGreen;
        this.takeBlue = takeBlue;
    }

    protected override applyCpu(image: CpuImage | null): CpuImage | null {
        const imageData = image?.getImageData();
        if (!imageData) return null;

        // We choose to do bitmasks, mainly because we can avoid having three branches
        // in the loop, which would make the performance even worse.
        const redMask = this.takeRed ? 0xff : 0;
        const greenMask = this.takeGreen ? 0xff : 0;
        const blueMask = this.takeBlue ? 0xff : 0;

        const pixelData = imageData.data.slice();
        for (let i = 0; i < pixelData.length; i += 4) {
            pixelData[i    ] &= redMask;
            pixelData[i + 1] &= greenMask;
            pixelData[i + 2] &= blueMask;
        }

        const resultImageData = new ImageData(pixelData, imageData.width, imageData.height);
        return CpuImage.fromImageData(resultImageData);
    }
}
