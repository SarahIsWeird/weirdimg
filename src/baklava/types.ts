import { BaklavaInterfaceTypes, IBaklavaViewModel, NodeInterfaceType } from 'baklavajs';
import { Image } from '../logic/image.ts';

export const numberType = new NodeInterfaceType<number>('number');
export const imageType = new NodeInterfaceType<Image>('image');
export const sizeType = new NodeInterfaceType<{x: number, y: number}>('size');
export const booleanType = new NodeInterfaceType<boolean>('boolean');

export const registerTypes = (baklava: IBaklavaViewModel) => {
    const nodeInterfaceTypes = new BaklavaInterfaceTypes(baklava.editor, {
        viewPlugin: baklava,
    });

    nodeInterfaceTypes.addTypes(
        numberType,
        imageType,
        sizeType,
        booleanType,
    );
};
