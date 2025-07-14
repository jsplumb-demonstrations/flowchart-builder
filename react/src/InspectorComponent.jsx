import React, {useRef, useState} from "react";

import { Node, Edge } from "@jsplumbtoolkit/browser-ui"
import {EdgeTypePickerComponent, InspectorComponent, ColorPickerComponent} from "@jsplumbtoolkit/browser-ui-react";
import {LINE_WIDTHS} from "./constants";

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
    const refresh = (obj, cb) => {
        setCurrentType(obj.objectType)
    }

    return <InspectorComponent refresh={refresh} renderEmptyContainer={renderEmptyContainer} ref={inspector}>

        { currentType === Node.objectType &&
        <div className="jtk-flowchart-inspector">
            <div className="jtk-flowchart-inspector-section">
        <div>Text</div>
        <input type="text" jtk-att="text" jtk-focus="true"/>
            </div>
            <div className="jtk-flowchart-inspector-section">
        <div>Fill</div>
        <ColorPickerComponent propertyName="fill" inspector={inspector.current.getInspector()}/>
            </div>
            <div className="jtk-flowchart-inspector-section">
                <div>Color</div>
                <ColorPickerComponent propertyName="textColor" inspector={inspector.current.getInspector()}/>
            </div>

            <div className="jtk-flowchart-inspector-section">
        <div>Outline</div>
        <ColorPickerComponent propertyName="outline" inspector={inspector.current.getInspector()}/>
            </div>
            <div className="jtk-flowchart-inspector-section">
                <div>Outline width</div>
                <select jtk-att="outlineWidth" jtk-datatype="integer">
                    {LINE_WIDTHS.map(lw => <option value={lw} key={lw}>{lw}</option>)}
                </select>
            </div>
        </div>

}

    { currentType === Edge.objectType &&
    <div className="jtk-flowchart-inspector">
        <div className="jtk-flowchart-inspector-section">
        <div>Label</div>
        <input type="text" jtk-att="label"/>
        </div>
        <div className="jtk-flowchart-inspector-section">
        <div>Line style</div>
    <EdgeTypePickerComponent edgeMappings={edgeMappings} propertyName="lineStyle" inspector={inspector.current.getInspector()}/>
        </div>
        <div className="jtk-flowchart-inspector-section">
    <div>Color</div>
        <ColorPickerComponent propertyName="color" inspector={inspector.current.getInspector()}/>
        </div>

        <div className="jtk-flowchart-inspector-section">
            <div>Line width</div>
            <select jtk-att="lineWidth" jtk-datatype="integer">
                {LINE_WIDTHS.map(lw => <option value={lw} key={lw}>{lw}</option>)}
            </select>
        </div>

        </div>
    }

    </InspectorComponent>
}
