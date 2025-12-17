<script lang="ts">

	export let index: number = 0;

    export let activatedIndex: number = 0;

    let clicked: boolean = false;	

    const amountClickHandler = () => {

		if (clicked && activatedIndex === (index + 1)) {
			clicked = !clicked;
			activatedIndex = 0;
		} else {
			clicked = !clicked;
			activatedIndex = (index + 1);
		};

    };

</script>

<button 
    class={ activatedIndex === (index + 1) ? "donate_amount_button_active" : "donate_amount_button" }
    on:click={() => amountClickHandler()}
    on:keyup={() => amountClickHandler()}
>
    <p>$</p><slot />
</button>

<style>
    .donate_amount_button {
		color: #4C4239;
		fill: #4C4239;
		background: none;
		border-radius: 1rem;
		border: solid 2px #4C4239;
		padding: 0.5rem 1rem;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
		box-shadow: none;
        will-change: color, background-color, box-shadow;
		transition: background-color 0.2s linear, color 0.2s linear, box-shadow 0.2s ease-out;
    }

	.donate_amount_button:hover {
		background-color: #E3CDB2;
	}

    .donate_amount_button_active {
		color: #4C4239;
		fill: #4C4239;
		background-color: #D8EAC5;
		border-radius: 1rem;
		border: solid 2px #4C4239;
		padding: 0.5rem 1rem;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
		box-shadow:
            0 1px 1px hsl(0deg 0% 0% / 0.075),
            0 2px 2px hsl(0deg 0% 0% / 0.075),
            0 4px 4px hsl(0deg 0% 0% / 0.075),
            0 8px 8px hsl(0deg 0% 0% / 0.075),
            0 16px 16px hsl(0deg 0% 0% / 0.075)
        ;
        will-change: color, background-color, box-shadow;
		transition: background-color 0.2s linear, color 0.2s linear, box-shadow 0.2s ease-out;
    }

	@media (max-width: 1440px) {
		.donate_amount_button {
			padding: 0.5rem 1rem;
			font-size: 1.25rem;
		}

		.donate_amount_button_active {
			padding: 0.5rem 1rem;
			font-size: 1.25rem;
		}
	}

	@media (max-width: 720px) {
		.donate_amount_button {
			padding: 0.5rem 1rem;
			font-size: 1rem;
		}

		.donate_amount_button_active {
			padding: 0.5rem 1rem;
			font-size: 1rem;
		}
	}
</style>