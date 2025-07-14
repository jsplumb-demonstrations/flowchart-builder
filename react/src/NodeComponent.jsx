import * as React from 'react';

import { ShapeComponent } from "@jsplumbtoolkit/browser-ui-react"

import anchorPositions from "./anchor-positions"

export default function NodeComponent({ctx}) {

    const { vertex, toolkit, surface } = ctx;
    const data = vertex.data;

    return <div style={{color:data.textColor}} className="jtk-flowchart-object" data-jtk-target="true">

        <ShapeComponent ctx={ctx} showLabels={true} labelProperty="text"/>

        {anchorPositions.map(ap => <div className={"jtk-connect jtk-connect-" + ap.id} data-jtk-anchor-x={ap.x} data-jtk-anchor-y={ap.y} data-jtk-orientation-x={ap.ox}  data-jtk-orientation-y={ap.oy} data-jtk-source="true" data-jtk-port-type="source" key={ap.id}/>)}

        <div className="node-action jtk-flowchart-node-clone" onClick={() => surface.cloneNode(vertex, {selectAfterCreate:true})}/>
        <div className="node-action jtk-flowchart-node-delete" onClick={() => toolkit.removeNode(vertex)}/>

    </div>
}
