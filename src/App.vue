<script setup lang="ts">
import { BaklavaEditor, useBaklava } from '@baklavajs/renderer-vue';
import '@baklavajs/themes/dist/syrup-dark.css';
import { ChannelSelector } from './nodes/color/channels.ts';
import { onMounted, ref } from 'vue';
import { registerTypes } from './baklava/types.ts';
import { CpuImage } from './logic/image.ts';
import { ImageSource, ImageViewer } from './nodes/io/image.ts';
import { DependencyEngine } from 'baklavajs';
import { BlackWhite, Threshold } from './nodes/color/bw.ts';

const baklava = useBaklava();
const engine = ref(new DependencyEngine(baklava.editor));

const sidebar = ref<HTMLDivElement | null>(null);

onMounted(async () => {
    registerTypes(baklava);

    baklava.editor.registerNodeType(ImageSource);
    baklava.editor.registerNodeType(ImageViewer);
    baklava.editor.registerNodeType(ChannelSelector);
    baklava.editor.registerNodeType(BlackWhite);
    baklava.editor.registerNodeType(Threshold);

    const cpuImage = await CpuImage.fromUrl('/bliss.png');
    const otherImg = cpuImage.getImage();
    await otherImg.decode();

    sidebar.value?.append(otherImg);

    engine.value.start();
});

</script>

<template>
    <div class="container">
        <div class="editor">
            <baklava-editor :view-model="baklava" />
        </div>
        <div ref="sidebar" class="sidebar"></div>
    </div>
</template>

<style>
.sidebar img {
    max-width: 100%;
    max-height: 100%;
}
</style>

<style scoped>
.container {
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: 1fr 10%;
}
</style>
