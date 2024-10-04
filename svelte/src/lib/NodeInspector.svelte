<script>
    import { PROPERTY_FILL, PROPERTY_TEXT, PROPERTY_TEXT_COLOR, PROPERTY_OUTLINE } from '../constants'
    export let inspector
</script>
<div>
	<div class="jtk-inspector-section">
		<div>Text</div>
		<input type="text" jtk-att={PROPERTY_TEXT} jtk-focus/>
	</div>

	<div class="jtk-inspector-section">
		<div>Fill</div>
		<input type="color" jtk-att={PROPERTY_FILL}/>
	</div>

	<div class="jtk-inspector-section">
		<div>Color</div>
		<input type="color" jtk-att={PROPERTY_TEXT_COLOR}/>
	</div>

	<div class="jtk-inspector-section">
		<div>Outline</div>
		<input type="color" jtk-att={PROPERTY_OUTLINE}/>
	</div>

</div>
