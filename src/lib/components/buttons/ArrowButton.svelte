<script lang="ts">
    import Arrow from "$lib/images/icons/arrow.svg?raw";
    export let openFilters: boolean = false;
</script>

<button 
    id="toggle_filters_button_sidedrawer_container"
    class={openFilters ? "toggle_filters_button_sidedrawer_open" : "toggle_filters_button_sidedrawer_closed"}
    on:click={() => openFilters = !openFilters}
    on:keyup={() => openFilters = !openFilters}

>
    {@html Arrow}
</button>

<style>
    #toggle_filters_button_sidedrawer_container {
		position: absolute;
		right: 1rem;
		top: 1rem;
		width: 2rem;
		background: none;
		border: none;
		fill: #4C4239;
		cursor: pointer;
        transition: transform 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	#toggle_filters_button_sidedrawer_container:hover {
		fill: #28387C;
	}

	.toggle_filters_button_sidedrawer_open {
		transform: rotate(180deg) rotateY(0deg);
	}

	.toggle_filters_button_sidedrawer_closed {
		transform: rotate(180deg) rotateY(180deg);
	}

	@media screen and (max-width: 720px) {
		.toggle_filters_button_sidedrawer_open {
			transform: rotate(270deg) rotateY(0deg);
		}

		.toggle_filters_button_sidedrawer_closed {
			transform: rotate(270deg) rotateY(180deg);
		}
	}
</style>