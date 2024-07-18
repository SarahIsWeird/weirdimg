import { CpuImage, Image } from '../image.ts';

export abstract class Effect {
    apply(image: Image | null): Image | null {
        if (!image) return null;

        if (image instanceof CpuImage) {
            return this.applyCpu(image);
        }

        throw new Error(`Unknown type: '${typeof image}`);
    }

    protected abstract applyCpu(image: CpuImage | null): CpuImage | null;
}
