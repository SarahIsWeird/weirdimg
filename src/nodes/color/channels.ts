import { CheckboxInterface, defineNode, NodeInterface, setType } from 'baklavajs';
import { booleanType, imageType } from '../../baklava/types.ts';
import { Image } from '../../logic/image.ts';
import { ChannelSelectionEffect } from '../../logic/effects/color/channels.ts';

export const ChannelSelector = defineNode({
    type: 'ChannelSelector',
    title: 'Channel selection',
    inputs: {
        input: () => new NodeInterface<Image | null>('Input', null)
            .use(setType, imageType),
        useRedChannel: () => new CheckboxInterface('Use red', true)
            .use(setType, booleanType),
        useGreenChannel: () => new CheckboxInterface('Use green', true)
            .use(setType, booleanType),
        useBlueChannel: () => new CheckboxInterface('Use blue', true)
            .use(setType, booleanType),
    },
    outputs: {
        output: () => new NodeInterface<Image | null>('Output', null)
            .use(setType, imageType),
    },
    calculate(inputs) {
        const filter = new ChannelSelectionEffect(
            inputs.useRedChannel,
            inputs.useGreenChannel,
            inputs.useBlueChannel,
        );

        const result = filter.apply(inputs.input);

        return {
            output: result,
        };
    },
});
