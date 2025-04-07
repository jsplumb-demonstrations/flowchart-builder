<script>

    import InspectorComponent from './Inspector.vue'
    import NodeComponent from './Node.vue'

    import { defineComponent } from "vue";

    import {
        AbsoluteLayout,
        EVENT_TAP,
        EdgePathEditor,
        FLOWCHART_SHAPES, BASIC_SHAPES,
        BlankEndpoint,
        OrthogonalConnector,
        DEFAULT,
        EVENT_CANVAS_CLICK,
        DrawingToolsPlugin,
        LassoPlugin,
        BackgroundPlugin,
        ShapeLibraryImpl,
        SelectionModes,
        SvgExporterUI,
        ImageExporterUI,
        LabelOverlay,
        consume

    } from "@jsplumbtoolkit/browser-ui"

    import { loadSurface, DEFAULT_VUE_SURFACE_ID } from "@jsplumbtoolkit/browser-ui-vue3"

    import {
        CLASS_EDGE_LABEL,
        CLASS_FLOWCHART_EDGE,
        DEFAULT_FILL,
        DEFAULT_STROKE,
        DEFAULT_TEXT_COLOR, EDGE_TYPE_TARGET_ARROW,
        GRID_BACKGROUND_OPTIONS,
        GRID_SIZE, PROPERTY_COLOR,
        PROPERTY_LABEL, PROPERTY_LINE_STYLE
    } from "../constants";

    import edgeMappings from "../edge-mappings";

    let toolkit
    let surface

    const shapeLibrary = new ShapeLibraryImpl([FLOWCHART_SHAPES, BASIC_SHAPES])

    export const anchorPositions = [
        {x:0, y:0.5, ox:-1, oy:0, id:"left"},
        {x:1, y:0.5, ox:1, oy:0, id:"right"},
        {x:0.5, y:0, ox:0, oy:-1, id:"top"},
        {x:0.5, y:1, ox:0, oy:1, id:"bottom"}
    ]

    export default defineComponent({
        name:"flowchart",
        components:{ InspectorComponent },
        mounted() {

            loadSurface(DEFAULT_VUE_SURFACE_ID, (s) => {
                surface = s;
                toolkit = surface.toolkitInstance;

                window.tk = toolkit

            })


        },
        methods:{
            toolkitParams:function() {
                return {
                    // set the Toolkit's selection mode to 'isolated', meaning it can select a set of edges, or a set of nodes, but it
                    // cannot select a set of nodes and edges. In this demonstration we use an inspector that responds to events from the
                    // toolkit's selection, so setting this to `isolated` helps us ensure we dont try to inspect edges and nodes at the same
                    // time.
                    selectionMode:SelectionModes.isolated,
                    // This is the payload to set when a user begins to drag an edge - we return values for the
                    // edge's label, color and line style. If you wanted to implement a mechanism whereby you have
                    // some "current style" you could update this method to return some dynamically configured
                    // values.
                    beforeStartConnect:(node, edgeType) => {
                        return {
                            [PROPERTY_LABEL]:"",
                            [PROPERTY_COLOR]:DEFAULT_STROKE,
                            [PROPERTY_LINE_STYLE]:EDGE_TYPE_TARGET_ARROW
                        }
                    }
                }
            },
            viewParams:function() {
                return {
                    nodes:{
                        default:{
                            component:NodeComponent,
                            // node can support any number of connections.
                            maxConnections: -1,
                            events: {
                                [EVENT_TAP]: (params) => {
                                    // if zero nodes currently selected, or the shift key wasnt pressed, make this node the only one in the selection.
                                    if (toolkit.getSelection()._nodes.length < 1 || params.e.shiftKey !== true) {
                                        toolkit.setSelection(params.obj)
                                    } else {
                                        // if multiple nodes already selected, or shift was pressed, add this node to the current selection.
                                        toolkit.addToSelection(params.obj)
                                    }
                                }
                            },
                            inject:{
                                shapeLibrary:shapeLibrary,
                                anchorPositions:anchorPositions
                            }
                        }
                    },
                    edges: {
                        [DEFAULT]: {
                            deleteButton:true, // show a delete button
                            connector: {
                                type:OrthogonalConnector.type,
                                options:{
                                    cornerRadius: 3,
                                    alwaysRespectStubs:true,
                                    stub:GRID_SIZE.w
                                }
                            },
                            cssClass:CLASS_FLOWCHART_EDGE,

                            outlineWidth:10,
                            events: {
                                click:(p) => {
                                    if (!p.e.defaultPrevented) {
                                        toolkit.setSelection(p.edge)
                                    }
                                }
                            },
                            overlays:[
                                {
                                    type:LabelOverlay.type,
                                    options:{
                                        useHTMLElement:false,
                                        cssClass:CLASS_EDGE_LABEL,
                                        label:"{{label}}",
                                        location:0.5
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            renderParams:function() {
                return {
                    shapes:{
                        library:shapeLibrary
                    },
                    grid:{
                        size:GRID_SIZE
                    },
                    events: {
                        [EVENT_CANVAS_CLICK]: (e) => {
                            toolkit.clearSelection()
                        }
                    },
                    propertyMappings:{
                        edgeMappings:edgeMappings()
                    },
                    useModelForSizes:true,
                    consumeRightClick: false,
                    dragOptions: {
                        filter: ".node-action, .node-action i"
                    },
                    plugins:[
                        DrawingToolsPlugin.type,
                        {
                            type:LassoPlugin.type,
                            options: {
                                lassoInvert:true,
                                lassoEdges:true
                            }
                        },
                        {
                            type:BackgroundPlugin.type,
                            options:GRID_BACKGROUND_OPTIONS
                        }
                    ],
                    zoomToFit:true,
                    defaults:{
                        edgesAvoidVertices:true
                    },
                    magnetize:{
                        constant:true,
                        trackback:true
                    }
                }
            }
        },
        data:() => {
            return {
                edgeMappings:edgeMappings(),
                shapeLibrary,
                dataGenerator:(el) => {
                    return {
                        textColor:DEFAULT_TEXT_COLOR,
                        outline:DEFAULT_STROKE,
                        fill:DEFAULT_FILL,
                        text:'',
                        outlineWidth:2
                    }
                }
            }
        }
    })
</script>
<template>
    <div id="app">

        <ExportControlsComponent/>

        <div class="jtk-demo-canvas">

            <SurfaceComponent :renderOptions="this.renderParams()"
                             :viewOptions="this.viewParams()"
                             :toolkitOptions="this.toolkitParams()"
                             url="copyright.json">
            </SurfaceComponent>

            <ControlsComponent/>
            <MiniviewComponent/>

        </div>
        <div class="jtk-demo-rhs">
            <!-- the node palette-->
            <div class="sidebar node-palette">
                <ShapePaletteComponent :data-generator="dataGenerator"
                                       initial-set="flowchart"></ShapePaletteComponent>
            </div>

            <!-- node/edge inspector -->
            <InspectorComponent v-bind:edge-mappings="edgeMappings"/>

            <div class="description">
                <p>
                    This sample application is a builder for flowcharts.
                </p>
            </div>
        </div>
    </div>
</template>
