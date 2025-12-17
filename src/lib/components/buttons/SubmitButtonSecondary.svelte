<script lang="ts">
	export let disable: boolean = false;
	export let clicked: boolean = false;
</script>

<button 
	class={disable ? "submit_button_disabled" : "submit_button"}
	type="submit"
	disabled={disable}
	on:click={() => clicked = true}
	on:keyup={() => clicked = true}
>
    <slot />
</button>

<style>

	.submit_button_disabled {
        margin: 1rem auto;
		color: #3A2B35;
		fill: #3A2B35;
		background-color: #E3CDB2;
        border: none;
		padding: 0.5rem 2rem;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 3rem;
		opacity: 50%;	
	}

    .submit_button {
        margin: 1rem auto;
		color: #3A2B35;
		fill: #3A2B35;
		background-color: #E3CDB2;
        border: none;
		padding: 0.5rem 2rem;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 3rem;
		cursor: pointer;
		transition: gap 0.2s ease-out, background-color 0.2s linear, color 0.2s linear, fill 0.2s linear;
	}

	.submit_button:disabled {
		opacity: 50%;
	}

	.submit_button:hover {
        color: #D8EAC5;
		fill: #D8EAC5;
		background-color: #3A2B35;
	}

    @media (max-width: 1140px) {
        .submit_button {
            font-size: 1.25rem;
        }

		.submit_button_disabled {
			font-size: 1.25rem;
        }
	}

	@media (max-width: 720px) {
        .submit_button {
            font-size: 1rem;
        }

		.submit_button_disabled {
			font-size: 1rem;
        }
	}
</style>