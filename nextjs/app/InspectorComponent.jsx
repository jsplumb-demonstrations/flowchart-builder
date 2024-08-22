import React, {useRef, useState} from "react";

import { Node, Edge } from "@jsplumbtoolkit/browser-ui"
import {EdgeTypePickerComponent, InspectorComponent} from "@jsplumbtoolkit/browser-ui-react";

/**
 * Inspector for flowchart objects. We use the InspectorComponent that ships with the React integration under the hood, providing our own
 * `refresh` and `renderEmptyContainer` methods. The contents of this component depend on the `currentType` - it changes between when a node or
 * an edge is selected.
 * @param edgeMappings
 * @constructor
 */
export default function FlowchartInspectorComponent({edgeMappings}) {

    const [currentType, setCurrentType] = useState('')
    const inspector = useRef(null)

    const renderEmptyContainer = () => setCurrentType('')
    const refresh= (obj, cb) => {
        setCurrentType(obj.objectType)
    }

    return <InspectorComponent refresh={refresh} renderEmptyContainer={renderEmptyContainer} ref={inspector}>

        { currentType === Node.objectType &&
        <div className="jtk-inspector jtk-node-inspector">
        <div>Text</div>
        <input type="text" jtk-att="text" jtk-focus="true"/>
        <div>Fill</div>
        <input type="color" jtk-att="fill"/>
        <div>Color</div>
        <input type="color" jtk-att="textColor"/>
        <div>Outline</div>
        <input type="color" jtk-att="outline"/>
        </div>
}

    { currentType === Edge.objectType &&
    <div className="jtk-inspector jtk-edge-inspector">
        <div>Label</div>
        <input type="text" jtk-att="label"/>
        <div>Line style</div>
    <EdgeTypePickerComponent edgeMappings={edgeMappings} propertyName="lineStyle" inspector={inspector.current.getInspector()}/>
    <div>Color</div>
    <input type="color" jtk-att="color"/>
        </div>
    }

    </InspectorComponent>
}
