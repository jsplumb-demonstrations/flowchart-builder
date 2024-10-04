<script>

import { SurfaceComponent,
  MiniviewComponent,
  ControlsComponent,
  SurfaceProvider,
  InspectorComponent,
  ShapeLibraryPaletteComponent,
  ExportControlsComponent
} from "@jsplumbtoolkit/browser-ui-svelte"

import { DEFAULT, EVENT_TAP,
    EVENT_CANVAS_CLICK,
  EVENT_DBL_CLICK,
  EVENT_CLICK,
    DrawingToolsPlugin,
    LassoPlugin,
    BackgroundPlugin,
    OrthogonalConnector,
  FLOWCHART_SHAPES,
        BASIC_SHAPES,
        newInstance,
        ShapeLibraryImpl,
  SelectionModes
  } from "@jsplumbtoolkit/browser-ui"

// import InspectorComponentNew from './lib/InspectorComponentNew.svelte'
import NodeInspector from './lib/NodeInspector.svelte'
import EdgeInspector from './lib/EdgeInspector.svelte'

// import FlowchartInspectorComponent from './lib/FlowchartInspectorComponent.svelte'
// import ShapeLibraryPaletteComponent from './lib/ShapeLibraryPaletteComponent.svelte'

// import ExportControlsComponent from './lib/ExportControlsComponent.svelte'

import NodeComponent from'./lib/NodeComponent.svelte'
import edgeMappings from './edge-mappings'
import {
  DEFAULT_FILL,
  DEFAULT_STROKE,
  DEFAULT_TEXT_COLOR,
  CLASS_EDGE_LABEL,
  CLASS_FLOWCHART_EDGE,
  GRID_BACKGROUND_OPTIONS,
  GRID_SIZE,
  EDGE_TYPE_TARGET_ARROW, PROPERTY_COLOR, PROPERTY_LABEL, PROPERTY_LINE_STYLE,
        anchorPositions
} from "./constants";


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


  let view = {
    nodes:{
      [DEFAULT]:{
        component:NodeComponent,
        // connections to/from this node can exist at any of the given anchorPositions
        anchorPositions,
        // node can support any number of connections.
        maxConnections: -1,
        events: {
          [EVENT_TAP]: ({toolkit, renderer, e, obj}) => {
            renderer.stopEditingPath()
            // if zero nodes currently selected, or the shift key wasnt pressed, make this node the only one in the selection.
            if (toolkit.getSelection()._nodes.length < 1 || e.shiftKey !== true) {
              toolkit.setSelection(obj)
            } else {
              // if multiple nodes already selected, or shift was pressed, add this node to the current selection.
              toolkit.addToSelection(obj)
            }
          }
        }
      }
    },
    // There are two edge types defined - 'yes' and 'no', sharing a common
    // parent.
    edges: {
      [DEFAULT]: {
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
          [EVENT_DBL_CLICK]: ({toolkit, renderer, edge}) => {
            toolkit.removeEdge(edge)
          },
          [EVENT_CLICK]: ({toolkit, renderer, edge}) => {
            toolkit.setSelection(edge)
            renderer.startEditingPath(edge, {
              deleteButton:true
            })
          }
        }
      }
    }
  }

  const renderOptions = {
    grid:{
      size:GRID_SIZE
    },
    events: {
      [EVENT_CANVAS_CLICK]: (surface) => {
        surface.toolkitInstance.clearSelection()
        surface.stopEditingPath()
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
    // set the size of elements from the width/height values in their backing data
    useModelForSizes:true,
    // on load, zoom the dataset so its all visible
    zoomToFit:true
  }

  const shapeLibrary = new ShapeLibraryImpl([FLOWCHART_SHAPES, BASIC_SHAPES])

  /**
   * Generator for data for nodes dragged from palette.
   * @param el
   */
  function dataGenerator (el) {
    return {
      fill:DEFAULT_FILL,
      outline:DEFAULT_STROKE,
      textColor:DEFAULT_TEXT_COLOR
    }
  }

  const inspectorMap = {
    "Node":NodeInspector,
    "Edge":EdgeInspector
  }

</script>
<div style="width:100%;height:100%;display:flex">
    <SurfaceProvider>

      <SurfaceComponent shapeLibrary={shapeLibrary}
                        renderOptions={renderOptions}
                        toolkit={toolkit}
                        viewOptions={view}
                        className="jtk-demo-canvas"
                        url="/copyright.json">

        <ControlsComponent/>
        <ExportControlsComponent/>
        <MiniviewComponent/>
      </SurfaceComponent>

      <div class="jtk-demo-rhs">
        <ShapeLibraryPaletteComponent className="node-palette" dataGenerator={dataGenerator} initialSet={FLOWCHART_SHAPES.id}/>
          <InspectorComponent inspectors={inspectorMap} className="jtk-inspector"/>
      </div>



    </SurfaceProvider>
</div>
