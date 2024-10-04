<script>

    import { anchorPositions } from "../constants"

	import { ShapeComponent } from "@jsplumbtoolkit/browser-ui-svelte"

	export let data;
	export let toolkit;
	export let surface;
	export let vertex;

	function removeNode() {
	    toolkit.removeNode(vertex)
    }

</script>

<div style="color:{data.textColor}" class="flowchart-object" data-jtk-target="true">

    <ShapeComponent surface={surface} vertex={vertex} data={data} showLabels="true" labelProperty="text"/>

    {#each anchorPositions as anchor}
		<div class="jtk-connect jtk-connect-{anchor.id}"
			 data-jtk-anchor-x={anchor.x}
			 data-jtk-anchor-y={anchor.y}
			 data-jtk-orientation-x={anchor.ox}
			 data-jtk-orientation-y={anchor.oy}
			 data-jtk-source="true"></div>
    {/each}

	<div class="node-delete node-action delete" on:click={() => removeNode()}></div>
</div>
