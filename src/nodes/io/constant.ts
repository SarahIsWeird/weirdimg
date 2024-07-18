import { defineNode, NodeInterface } from 'baklavajs';

export const NumberConstant = defineNode({
    type: 'NumberConstant',
    outputs: {
        output: () => new NodeInterface('Number', 0),
    },
    inputs: {
        
    }
});
