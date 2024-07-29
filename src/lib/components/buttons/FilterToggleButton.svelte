<script lang="ts">
    import FilterIcon from "$lib/images/icons/filter_icon.svg?raw";
    import Arrow from "$lib/images/icons/arrow.svg?raw";

    export let openFilters: boolean = true;

</script>

<button 
    on:click={() => openFilters = !openFilters}
    class="filter_button"
>
    
    <slot />
    <div class="filter_icon">
        {@html FilterIcon}
    </div>
    <div class={openFilters ? "filters_open_arrow" : "filters_closed_arrow"}>
        {@html Arrow}
    </div>
</button>

<style>
    .filter_button {
        width: auto;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: transparent;
        border: none;
        font-size: 1.25rem;
        color: #4C4239;
        fill: #4C4239;
        padding: 0 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: color 0.2s linear, fill 0.2s linear;
    }

    .filter_button:hover {
        color: #28387C;
        fill: #28387C;
    }

    .filter_icon {
        width: 1.75rem;
    }

    .filters_open_arrow {
        width: 0.6rem;
        transform: rotate(180deg) rotateY(0deg);
        display: flex;
        flex-direction: row;
        align-items: center;
        will-change: transform;
        transition: transform 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .filters_closed_arrow {
        width: 0.6rem;
        transform: rotate(180deg) rotateY(180deg);
        display: flex;
        flex-direction: row;
        align-items: center;
        will-change: transform;
        transition: transform 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    @media (max-width: 1440px) {
        .filter_button {
            gap: 0.5rem;
            font-size: 1.1rem;
            padding: 0 1rem;
        }

        .filter_icon {
            width: 1.5rem;
        }

        .filters_open_arrow {
            width: 0.5rem;
        }

        .filters_closed_arrow {
            width: 0.5rem;
        }
    }

    @media (max-width: 720px) {
        .filter_button {
            gap: 0.5rem;
            font-size: 0.9rem;
            padding: 0 1rem;
        }

        .filter_icon {
            width: 1.25rem;
        }

        .filters_open_arrow {
            width: 0.4rem;
			transform: rotateY(0) rotateX(180deg) rotate(90deg);
			will-change: transform;
			transition: transform 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
		}

		.filters_closed_arrow {
            width: 0.4rem;
			transform: rotateY(0) rotateX(0) rotate(90deg);
			will-change: transform;
			transition: transform 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
		}
    }
</style>