<template>
    <div ref="container">

        <h1 v-if="currentType===''"></h1>

        <div v-if="currentType === 'Node'" class="jtk-flowchart-inspector">
            <div className="jtk-flowchart-inspector-section">
            <div>Text</div>
            <input type="text" jtk-att="text" jtk-focus/>
            </div>
            <div className="jtk-flowchart-inspector-section">

            <div>Fill</div>
            <ColorPicker :inspector="inspector" property-name="fill"/>
            </div>
            <div className="jtk-flowchart-inspector-section">
            <div>Color</div>
            <ColorPicker :inspector="inspector" property-name="textColor"/>
            </div>
            <div className="jtk-flowchart-inspector-section">
            <div>Outline</div>
            <ColorPicker :inspector="inspector" property-name="outline"/>
            </div>
            <div class="jtk-flowchart-inspector-section">
                <div>Outline width</div>
                <select jtk-att="outlineWidth" jtk-datatype="integer">
                    <option v-for="lw of LINE_WIDTHS" :value="lw">{{lw}}</option>
                </select>
            </div>
        </div>

        <div v-if="currentType === 'Edge'" class="jtk-flowchart-inspector">
            <div className="jtk-flowchart-inspector-section">
            <div>Label</div>
            <input type="text" jtk-att="label"/>
            </div>
            <div className="jtk-flowchart-inspector-section">
            <div>Line style</div>
            <EdgeTypePicker :edgeMappings="edgeMappings" :inspector="inspector" property-name="lineStyle"/>
            </div>
            <div className="jtk-flowchart-inspector-section">
            <div>Color</div>
            <ColorPicker :inspector="inspector" property-name="color"/>
            </div>
            <div class="jtk-flowchart-inspector-section">
                <div>Line width</div>
                <select jtk-att="lineWidth" jtk-datatype="integer">
                    <option v-for="lw of LINE_WIDTHS" :value="lw">{{lw}}</option>
                </select>
            </div>
        </div>


    </div>
</template>
<script>

    import {loadSurface, ColorPicker} from "@jsplumbtoolkit/browser-ui-vue3";
    import { Inspector } from "@jsplumbtoolkit/browser-ui"
    import { defineComponent } from "vue";

    import { LINE_WIDTHS } from "../constants";

    import { nextTick } from "vue"

    export default defineComponent({
        components:{ ColorPicker },
        data:() => {
            return {
                currentType:'',
                inspector:null,
                LINE_WIDTHS
            }
        },
        props:{
            edgeMappings:Array
        },
        mounted() {
            loadSurface((surface) => {
                // create an inspector and give it the container element
                // and the surface.

                this.inspector = new Inspector({
                    container:this.$refs.container,
                    surface,
                    renderEmptyContainer:() => this.currentType = '',
                    refresh:(obj, cb) => {
                        this.currentType = obj.objectType
                        nextTick(cb)
                    }
                })
            })
        }
    })
</script>
