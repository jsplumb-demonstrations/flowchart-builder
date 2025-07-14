import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

import { anchorPositions } from "./app.component"

@Component({
    template:`<div style="color:{{obj.textColor}}" class="jtk-flowchart-object" data-jtk-target="true">
        
        <jtk-shape [obj]="obj" [label]="obj.text" showLabels="true" labelProperty="text" [width]="obj.width" [height]="obj.height"></jtk-shape>

        <div *ngFor="let anchor of anchorPositions" 
             class="jtk-connect jtk-connect-{{anchor.id}}" 
             [attr.data-jtk-anchor-x]="anchor.x" 
             [attr.data-jtk-anchor-y]="anchor.y" 
             [attr.data-jtk-orientation-x]="anchor.ox" 
             [attr.data-jtk-orientation-y]="anchor.oy" 
             data-jtk-source="true"></div>

		<div aria-title="Clone this node" title="Clone this node" class="node-action jtk-flowchart-node-clone" (click)="this.cloneNode({selectAfterCreate:true})"></div>
        <div aria-title="Delete node" title="Delete Node" class="node-action jtk-flowchart-node-delete" (click)="this.removeNode()"></div>
    </div>`
})
export class NodeComponent extends BaseNodeComponent {
    anchorPositions = anchorPositions
}
