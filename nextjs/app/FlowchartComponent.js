"use client"
import React, { useEffect, useRef } from 'react';

import {
    SurfaceComponent,
    MiniviewComponent,
    ShapeLibraryPaletteComponent,
    ControlsComponent,
    ExportControlsComponent,
    SurfaceProvider
} from "@jsplumbtoolkit/browser-ui-react";

import { DEFAULT, EVENT_DBL_CLICK, EVENT_CLICK, EVENT_TAP,
    BlankEndpoint, OrthogonalConnector,
    BackgroundPlugin, LassoPlugin, DrawingToolsPlugin,
    EVENT_CANVAS_CLICK,
    ShapeLibraryImpl,
    FLOWCHART_SHAPES, BASIC_SHAPES,
    SelectionModes, newInstance,
    initializeOrthogonalConnectorEditors
} from "@jsplumbtoolkit/browser-ui"

import Inspector from './InspectorComponent'
import NodeComponent from './NodeComponent'

import {
    DEFAULT_FILL,
    DEFAULT_STROKE,
    DEFAULT_TEXT_COLOR,
    CLASS_EDGE_LABEL,
    CLASS_FLOWCHART_EDGE,
    GRID_BACKGROUND_OPTIONS,
    GRID_SIZE,
    EDGE_TYPE_TARGET_ARROW, PROPERTY_COLOR, PROPERTY_LABEL, PROPERTY_LINE_STYLE
} from "./constants";

import edgeMappings from "./edge-mappings"

import './index.css'

//
// these anchor positions are used by the drag/drop of new edges, and also by the edge path editor
//
export const anchorPositions = [
    {x:0, y:0.5, ox:-1, oy:0, id:"left" },
    {x:1, y:0.5, ox:1, oy:0, id:"right" },
    {x:0.5, y:0, ox:0, oy:-1, id:"top" },
    {x:0.5, y:1, ox:0, oy:1, id:"bottom" }
]

export default function FlowchartComponent() {

    const initialized = useRef(false)
    const shapeLibrary = new ShapeLibraryImpl([FLOWCHART_SHAPES, BASIC_SHAPES])

    const surfaceComponent = useRef(null)
    const surface = useRef(null)

    /**
     * Generator for data for nodes dragged from palette.
     * @param el
     */
    const dataGenerator = (el) => {
        return {
            fill:DEFAULT_FILL,
            outline:DEFAULT_STROKE,
            textColor:DEFAULT_TEXT_COLOR
        }
    }

    const toolkit = newInstance({
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
    })

    initializeOrthogonalConnectorEditors()


    const view = {
        nodes: {
            [DEFAULT]: {
                jsx: (ctx) => <NodeComponent ctx={ctx}/>,
                // connections to/from this node can exist at any of the given anchorPositions
                anchorPositions,
                // node can support any number of connections.
                maxConnections: -1,
                events: {
                    [EVENT_TAP]: (params) => {
                        surface.current.stopEditingPath()
                        // if zero nodes currently selected, or the shift key wasnt pressed, make this node the only one in the selection.
                        if (toolkit.getSelection()._nodes.length < 1 || params.e.shiftKey !== true) {
                            toolkit.setSelection(params.obj)
                        } else {
                            // if multiple nodes already selected, or shift was pressed, add this node to the current selection.
                            toolkit.addToSelection(params.obj)
                        }
                    }
                }
            }
        },
        // There are two edge types defined - 'yes' and 'no', sharing a common
        // parent.
        edges: {
            [DEFAULT]: {
                endpoint: BlankEndpoint.type,
                connector: {
                    type: OrthogonalConnector.type,
                    options: {
                        stub:GRID_SIZE.w
                    }
                },
                cssClass:CLASS_FLOWCHART_EDGE,
                labelClass:CLASS_EDGE_LABEL,
                label:"{{label}}",
                outlineWidth:10,
                events: {
                    [EVENT_DBL_CLICK]: (params) => {
                        toolkit.removeEdge(params.edge)
                    },
                    [EVENT_CLICK]: (params) => {
                        toolkit.setSelection(params.edge)
                        surface.current.startEditingPath(params.edge, {
                            deleteButton:true
                        })
                    }
                }
            }
        }
    }

    const renderParams = {
        grid:{
            size:GRID_SIZE
        },
        events: {
            [EVENT_CANVAS_CLICK]: (e) => {
                toolkit.clearSelection()
                surface.current.stopEditingPath()
            }
        },
        propertyMappings:{
            edgeMappings:edgeMappings()
        },
        editablePaths:true,
        consumeRightClick: false,
        dragOptions: {
            filter: ".jtk-draw-handle, .node-action, .node-action i"
        },
        plugins:[
            {
                type:DrawingToolsPlugin.type,
                options:{
                    widthAttribute:"width",
                    heightAttribute:"height"
                }
            },
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
        // set the size of elements from the width/height values in their backing data
        useModelForSizes:true,
        // on load, zoom the dataset so its all visible
        zoomToFit:true
    }

    // set a couple of refs and load data on "mount"
    useEffect(() => {

        if (!initialized.current) {
            initialized.current = true

            surface.current = surfaceComponent.current.getSurface()

            // load an initial dataset
            toolkit.load({url:"/copyright.json"})
        }

    }, [])

    return  <div style={{width:"100%",height:"100%",display:"flex"}}>
<div className="jtk-demo-canvas">
        <SurfaceProvider>
            <SurfaceComponent shapeLibrary={shapeLibrary} renderOptions={renderParams} toolkit={toolkit} viewOptions={view} ref={ surfaceComponent }>
                <ControlsComponent/>
                <ExportControlsComponent/>
                <MiniviewComponent/>
            </SurfaceComponent>

            <div className="jtk-demo-rhs">
                <ShapeLibraryPaletteComponent
                    className="node-palette" dataGenerator={dataGenerator} initialSet={FLOWCHART_SHAPES.id}/>
                <Inspector edgeMappings={edgeMappings()}/>
            </div>
        </SurfaceProvider>

    </div>
    </div>
}
