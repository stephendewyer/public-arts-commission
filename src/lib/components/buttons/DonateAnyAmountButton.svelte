<script lang="ts">
	import InputErrorMessage from "$lib/components/errorMessages/InputErrorMessage.svelte";

    export let anyAmountClicked: boolean = false;

    export let activatedIndex: number = 0;

	export let anyAmountValue: number | undefined;

	export let anyAmountIsValid: boolean = true;

	let anyAmountIsTouched: boolean = false;

	$: if (activatedIndex !== 7) {
		anyAmountIsValid = true;
		anyAmountIsTouched = false;
	};

    const anyAmountClickHandler = () => {
        if (anyAmountClicked)
        anyAmountClicked = !anyAmountClicked;
        activatedIndex = 7;
    };

	const anyAmountFocusHandler = () => {
		if (anyAmountIsTouched) {
			if (anyAmountValue === undefined || anyAmountValue <= 0) {
				anyAmountIsValid = false;
			} else {
				anyAmountIsValid = true;
			}
		} else if (!anyAmountIsTouched) {
            anyAmountIsValid = true;
        }
	};

	const anyAmountBlurHandler = () => {
		anyAmountIsTouched = true;
		if (anyAmountValue === undefined || anyAmountValue <= 0) {
			anyAmountIsValid = false;
		} else {
			anyAmountIsValid = true;
		}
	};

	const inputValueChangeHandler = () => {
		if (anyAmountIsTouched) {
			if (anyAmountValue === undefined || anyAmountValue <= 0) {
				anyAmountIsValid = false;
			} else {
				anyAmountIsValid = true;
			}
		} else if (!anyAmountIsTouched) {
            anyAmountIsValid = true;
        }
	};

</script>

<div class="donate_any_amount_button_container">
	<button 
		class={ activatedIndex === 7 ? "donate_amount_button_active" : "donate_amount_button" }
		on:click={() => anyAmountClickHandler()}
		on:keyup={() => anyAmountClickHandler()}
	>
		<p>$</p>
		<input 
			class={ activatedIndex === 7 ? "anyAmountInputActive" : "anyAmountInput" } 
			bind:value={anyAmountValue}
			on:focus={() => anyAmountFocusHandler()}
			on:blur={() => anyAmountBlurHandler()}
			on:input={() => inputValueChangeHandler()}
			step="0.01"
			type="number"
		/>
	</button>
	{#if (!anyAmountIsValid)}
		<InputErrorMessage>a valid amount required</InputErrorMessage>
	{/if}
</div>


<style>

	.donate_any_amount_button_container {
		display: flex;
		flex-direction: column;
	}

    .donate_amount_button {
		color: #4C4239;
		fill: #4C4239;
		background: none;
		border: solid 2px #4C4239;
		border-radius: 1rem;
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
		border: solid 2px #4C4239;
		border-radius: 1rem;
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

	.anyAmountInput {
		background: transparent;
		color: #4C4239;
		border-top: 0;
		border-left: 0;
		border-right: 0;
		border-bottom: 2px #4C4239 solid;
		outline: none;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.anyAmountInputActive {
		background: transparent;
		color: #4C4239;
		border-top: 0;
		border-left: 0;
		border-right: 0;
		border-bottom: 2px #4C4239 solid;
		outline: none;
		font-size: 1.5rem;
		font-weight: 600;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
	}

	/* Firefox */
	input[type=number] {
		-moz-appearance: textfield;
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

		.anyAmountInput {
			font-size: 1.25rem;
		}

		.anyAmountInputActive {
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

		.anyAmountInput {
			font-size: 1rem;
		}

		.anyAmountInputActive {
			font-size: 1rem;
		}
	}
</style>