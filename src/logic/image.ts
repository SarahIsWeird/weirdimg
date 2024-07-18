const loadImageFromUrl = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = src;

        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image from url: '${src}'`));
    });
};

export abstract class Image {
    protected source: HTMLImageElement;
    protected canvas: HTMLCanvasElement;

    protected constructor(source: HTMLImageElement) {
        if (source instanceof HTMLImageElement) {
            this.source = source;
        } else {
            this.source = document.createElement('img');
            this.source.src = source;
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.source.width;
        this.canvas.height = this.source.height;
    }

    abstract getImage(): HTMLImageElement;
}

export class CpuImage extends Image {
    private ctx: CanvasRenderingContext2D | null = null;

    constructor(source: HTMLImageElement) {
        super(source);

        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;

        this.ctx = ctx;
        this.ctx.drawImage(this.source, 0, 0);
    }

    static async fromUrl(src: string) {
        const img = await loadImageFromUrl(src);
        return new CpuImage(img);
    }

    static fromImageData(data: ImageData): CpuImage {
        // Dummy <img> to set the size and prime the canvas
        const img = document.createElement('img');
        img.width = data.width;
        img.height = data.height;

        const cpuImage = new CpuImage(img);
        cpuImage.ctx?.putImageData(data, 0, 0);
        return cpuImage;
    }

    override getImage(): HTMLImageElement {
        const img = document.createElement('img');
        img.src = this.canvas.toDataURL('image/png');
        return img;
    }

    getImageData(): ImageData | null {
        if (!this.ctx) return null;
        if (!this.ctx.getImageData) return null;

        try {
            return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        } catch (e) {
            console.warn('Failed to get image data from context!', e);
            return null;
        }
    }
}
