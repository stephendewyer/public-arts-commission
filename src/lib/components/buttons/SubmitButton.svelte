<script lang="ts">
    import Arrow from "$lib/images/icons/arrow.svg?raw";

    export let disable: boolean;
</script>

<button 
    class={ disable ? "submit_button_disabled" : "submit_button" }
    type="submit"
    disabled={disable}
>
    <slot />
    <div class="arrow">
        {@html Arrow}
    </div>
</button>

<style>

    .submit_button_disabled {
        display: none;
    }

    .submit_button {
        margin: 1rem auto;
		color: #3A2B35;
		fill: #3A2B35;
		background-color: #E3CDB2;
        border: none;
		padding: 0.5rem 1rem;
		gap: 0.5rem;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 3rem;
		cursor: pointer;
		transition: gap 0.2s ease-out, background-color 0.2s linear, color 0.2s linear, fill 0.2s linear;
	}

	.submit_button:hover {
        color: #D8EAC5;
		fill: #D8EAC5;
		background-color: #3A2B35;
		gap: 1rem;
	}

	.arrow {
		width: 0.6rem;
	}

    @media (max-width: 1140px) {
        .submit_button {
            font-size: 1.25rem;
        }

        .arrow {
            width: 0.5rem;
        }
	}

	@media (max-width: 720px) {
        .submit_button {
            font-size: 1rem;
        }

        .arrow {
            width: 0.4rem;
        }
	}
</style>