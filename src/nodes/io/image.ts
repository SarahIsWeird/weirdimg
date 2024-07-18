import { defineNode, NodeInterface, setType } from 'baklavajs';
import { CpuImage, Image } from '../../logic/image.ts';
import { imageType } from '../../baklava/types.ts';

export const ImageSource = defineNode({
    type: 'ImageSource',
    title: 'Image source',
    outputs: {
        output: () => new NodeInterface<Image | null>('Output', null)
            .use(setType, imageType),
    },
    async calculate() {
        const img = await CpuImage.fromUrl('/bliss.png');
        return {
            output: img,
        };
    },
});

export const ImageViewer = defineNode({
    type: 'ImageViewer',
    title: 'Image viewer',
    inputs: {
        input: () => new NodeInterface<Image | null>('Input', null)
            .use(setType, imageType),
    },
    async calculate({ input }) {
        if (!input) return {};
        const img = input.getImage();
        await img.decode();

        const sidebar = document.getElementsByClassName('sidebar')[0];
        sidebar.replaceChildren(img);
        return {};
    },
});
