<script>

    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue3'

    export default {
        mixins:[BaseNodeComponent],
        props:["shapeLibrary", "anchorPositions"]
    }

</script>
<template>
    <div :style="{color:obj.textColor}" class="jtk-flowchart-object" data-jtk-target="true">
        <ShapeComponent :obj="obj" :shape-library="shapeLibrary" :show-labels="true" label-property="text"></ShapeComponent>
        <div v-for="anchor in anchorPositions"
             :class="'jtk-connect jtk-connect-' + anchor.id"
             :data-jtk-anchor-x="anchor.x"
             :data-jtk-anchor-y="anchor.y"
             :data-jtk-orientation-x="anchor.ox"
             :data-jtk-orientation-y="anchor.oy"
             data-jtk-source="true"
             data-jtk-port-type="source"></div>
        <div class="jtk-flowchart-node-delete node-action delete" @click="this.removeNode()"></div>
    </div>
</template>
