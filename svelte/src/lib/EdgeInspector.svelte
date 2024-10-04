<script>

    import { PROPERTY_LABEL, PROPERTY_LINE_STYLE, PROPERTY_COLOR } from "../constants"
    import edgeMappings from "../edge-mappings"
	import { EdgeTypePickerComponent } from "@jsplumbtoolkit/browser-ui-svelte"

	export let inspector

</script>
<div>
	<div>Label</div>
	<input type="text" jtk-att={PROPERTY_LABEL}/>
	<div>Line style</div>
    <EdgeTypePickerComponent inspector={inspector} propertyName={PROPERTY_LINE_STYLE} edgeMappings={edgeMappings()}/>
	<div>Color</div>
	<input type="color" jtk-att={PROPERTY_COLOR}/>
</div>
