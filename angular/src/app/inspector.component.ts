import {
    Component
} from "@angular/core"
import {InspectorComponent} from "@jsplumbtoolkit/browser-ui-angular"
import {Edge, Node} from "@jsplumbtoolkit/browser-ui"
import edgeMappings from './edge-mappings'
import {LINE_WIDTHS} from "./constants"

/**
 * Inspector for the flowchart.  This component extends JsPlumb Angular's `InspectorComponent` Directive, which is a render-agnostic manager
 * for a set of nodes/edges.
 *
 * This component uses the `currentObjectType` member from the superclass (which is updated inside the `refresh` method
 * that the superclass invokes) to determine what to render.
 *
 * Our template includes `jtk-att` attributes on the various input fields. Using these, the underlying
 * inspector is able to set/retrieve the current values.
 *
 * The `jtk-edge-type` component used in the edge inspector is a special case. It is a component that ships with the Toolkit
 * (from version 6.2.0 onwards) and which itself uses an underlying EdgeTypePicker to render a set of EdgePropertyMappings and
 * to allow the user to pick one. We have to tell the `edge-type-picker` about the set of edge mappings we want it to use,
 * and the inspector to interact with, as well as the name of the property that we're mapping. You could have multiple
 * `edge-type-picker` components in an inspector, with a different propertyName mapped to each one.
 */
@Component({
    template: `<div class="inspector">
        
        @if(currentObjectType === EDGE) {
            <div class="jtk-flowchart-inspector">
                <div class="jtk-flowchart-inspector-section">
                    <div>Label</div>
                    <input type="text" jtk-att="label"/>
                </div>
                <div class="jtk-flowchart-inspector-section">    
                    <div>Line style</div>
                    <jtk-edge-type [edgeMappings]="edgeMappings" propertyName="lineStyle" [inspector]="inspector"></jtk-edge-type>
                </div>
                <div class="jtk-flowchart-inspector-section">    
                    <div>Color</div>
                    <jtk-color [inspector]="inspector" propertyName="color"/>
                </div>
                <div class="jtk-flowchart-inspector-section">    
                    <div>Line width</div>
                    <select jtk-att="lineWidth" jtk-datatype="integer">
                        @for(lw of LINE_WIDTHS;track lw) {
		                    <option [value]="lw">{{lw}}</option>
		                }
                    </select>
                </div>    
            </div>
        }    
        
        @if(currentObjectType === NODE) {
            <div class="jtk-flowchart-inspector">               
                <div class="jtk-flowchart-inspector-section">
                    <div>Text</div>
                    <input type="text" jtk-att="text" jtk-focus/>
                </div>    
    
                <div class="jtk-flowchart-inspector-section">
                    <div>Fill</div>
                    <jtk-color [inspector]="inspector" propertyName="fill"/>
                </div>
    
                <div class="jtk-flowchart-inspector-section">
                    <div>Color</div>
                    <jtk-color [inspector]="inspector" propertyName="textColor"/>
                </div>    
    
                <div class="jtk-flowchart-inspector-section">
                    <div>Outline</div>
                    <jtk-color [inspector]="inspector" propertyName="outline"/>
                </div>
                
                <div class="jtk-flowchart-inspector-section">    
                    <div>Outline width</div>
                    <select jtk-att="outlineWidth" jtk-datatype="integer">
                        @for(lw of LINE_WIDTHS;track lw) {
		                    <option [value]="lw">{{lw}}</option>
                        }
                    </select>
                </div>    
            </div>
        }    
    </div>`,
    selector: 'app-inspector'
})
export class FlowchartInspectorComponent extends InspectorComponent {
    edgeMappings = edgeMappings();
    EDGE = Edge.objectType
    NODE = Node.objectType
    LINE_WIDTHS = LINE_WIDTHS

}
