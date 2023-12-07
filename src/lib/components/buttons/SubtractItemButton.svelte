<script lang="ts">

    export let index: number;

    export let subtractItemsClicked: boolean = false;

    export let subtractedItemIndex: null | number = null;

    const subtractItemClickedHandler = () => {

        subtractItemsClicked = true;
        subtractedItemIndex = index;

    };

</script>

<button 
    tabindex={1}
    class="subtract_button"
    on:click|preventDefault={subtractItemClickedHandler}
    on:keyup|preventDefault={subtractItemClickedHandler}
>
    <div class="subtract_sign">
        -
    </div>
    <slot />
</button>

<style>

    .subtract_button {
        margin: auto 0;
		color: #4F1313;
		fill: #4F1313;
		background-color: transparent;
		border: solid 3px #4F1313;
		padding: 0.5rem 1rem;
		gap: 0.5rem;
		font-size: 1.25rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 3rem;
		cursor: pointer;
		transition: border 0.2s linear, background-color 0.2s linear;
	}

	.subtract_button:hover {
		color: #9F1D20;
		fill: #9F1D20;
        border: solid 3px #9F1D20;
	}


	.subtract_sign {
		width: 0.6rem;
	}

    @media (max-width: 1140px) {
        .subtract_button {
            font-size: 1rem;
        }

        .subtract_sign {
            width: 0.5rem;
        }
	}

	@media (max-width: 720px) {
        .subtract_button {
            font-size: 0.8rem;
        }

        .subtract_sign {
            width: 0.4rem;
        }
	}
</style>