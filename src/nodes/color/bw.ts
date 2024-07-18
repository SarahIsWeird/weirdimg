import {
    CheckboxInterface,
    defineDynamicNode, defineNode, IntegerInterface,
    NodeInterface,
    SelectInterface,
    setType,
    SliderInterface
} from 'baklavajs';
import { Image } from '../../logic/image.ts';
import { booleanType, imageType } from '../../baklava/types.ts';
import { Effect } from '../../logic/effects/effect.ts';
import {
    GreyscaleFromAverageEffect,
    GreyscaleFromBlueEffect,
    GreyscaleFromGreenEffect,
    GreyscaleFromRedEffect, ThresholdEffect
} from '../../logic/effects/color/bw.ts';

enum BWType {
    GREY_FROM_RED,
    GREY_FROM_GREEN,
    GREY_FROM_BLUE,
    GREY_FROM_AVERAGE,
}

export const BlackWhite = defineNode({
    type: 'BlackWhite',
    title: 'Black/white',
    inputs: {
        input: () => new NodeInterface<Image | null>('Input', null)
            .use(setType, imageType),
        type: () =>
            new SelectInterface<BWType>(
                'Type',
                BWType.GREY_FROM_AVERAGE,
                [
                    { text: 'Grey from red channel', value: BWType.GREY_FROM_RED },
                    { text: 'Grey from green channel', value: BWType.GREY_FROM_GREEN },
                    { text: 'Grey from blue channel', value: BWType.GREY_FROM_BLUE },
                    { text: 'Grey from average', value: BWType.GREY_FROM_AVERAGE },
                ])
                .setPort(false)
    },
    outputs: {
        output: () => new NodeInterface<Image | null>('Output', null)
            .use(setType, imageType),
    },
    calculate({ input, type }) {
        let effect: Effect;
        switch (type) {
            case BWType.GREY_FROM_RED:
                effect = new GreyscaleFromRedEffect();
                break;
            case BWType.GREY_FROM_GREEN:
                effect = new GreyscaleFromGreenEffect();
                break;
            case BWType.GREY_FROM_BLUE:
                effect = new GreyscaleFromBlueEffect();
                break;
            case BWType.GREY_FROM_AVERAGE:
                effect = new GreyscaleFromAverageEffect();
                break;
        }

        return {
            output: effect.apply(input),
        };
    }
});

export const Threshold = defineDynamicNode({
    type: 'Threshold',
    title: 'Threshold',
    inputs: {
        input: () => new NodeInterface<Image | null>('Input', null)
            .use(setType, imageType),
        linkChannels: () => new CheckboxInterface('Link channels', false)
            .use(setType, booleanType)
            .setPort(false),
    },
    onUpdate({ linkChannels}) {
        if (linkChannels) {
            return {
                inputs: {
                    threshold: () => new SliderInterface('Threshold', 128, 0, 255),
                },
            };
        }

        return {
            inputs: {
                redThreshold: () => new IntegerInterface('Red threshold', 128, 0, 255),
                greenThreshold: () => new IntegerInterface('Green threshold', 128, 0, 255),
                blueThreshold: () => new IntegerInterface('Blue threshold', 128, 0, 255),
            },
        };
    },
    outputs: {
        output: () => new NodeInterface<Image | null>('Output', null)
            .use(setType, imageType),
    },
    calculate(inputs) {
        const { input, linkChannels } = inputs;
        if (!input) return {
            output: null
        };

        let effect: Effect;
        if (linkChannels) {
            effect = new ThresholdEffect(inputs.threshold, inputs.threshold, inputs.threshold);
        } else {
            effect = new ThresholdEffect(inputs.redThreshold, inputs.greenThreshold, inputs.blueThreshold);
        }

        const result = effect.apply(input);
        return {
            output: result,
        };
    }
});
