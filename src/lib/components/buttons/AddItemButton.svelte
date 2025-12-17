<script lang="ts">

    export let addItemClicked: boolean = false;

    const addItemClickedHandler = () => {

        addItemClicked = !addItemClicked;

    };

</script>

<button 
    tabindex={1}
    class="add_button"
    on:click={addItemClickedHandler}
    on:keyup={addItemClickedHandler}
>
    <div class="plus_sign">
        +
    </div>
    <slot />
</button>

<style>

    .add_button {
        margin: 0;
		color: #4C4239;
		fill: #4C4239;
		background-color: transparent;
		border: solid 3px #4C4239;
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

	.add_button:hover {
		color: #3A2B35;
		fill: #3A2B35;
        border: solid 3px #3A2B35;
	}


	.plus_sign {
		width: 0.6rem;
	}

    @media (max-width: 1140px) {
        .add_button {
            font-size: 1rem;
        }

        .plus_sign {
            width: 0.5rem;
        }
	}

	@media (max-width: 720px) {
        .add_button {
            font-size: 0.8rem;
        }

        .plus_sign {
            width: 0.4rem;
        }
	}
</style>