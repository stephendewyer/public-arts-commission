<script>
    import Arrow from "$lib/images/icons/arrow.svg?raw";
</script>

<button class="submit_button">
    <slot />
    <div class="arrow">
        {@html Arrow}
    </div>
</button>

<style>

    .submit_button {
        margin: 0.5rem 0;
		color: #4C4239;
		fill: #4C4239;
		background-color: transparent;
        text-align: left;
		border: none;
		padding: 0 0 0.5rem 0;
		gap: 0.5rem;
		font-size: 1.25rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 3rem;
		cursor: pointer;
		transition: gap 0.2s ease-out, fill 0.2s linear, color 0.2s linear;
	}

	.submit_button:hover {
		gap: 1rem;
        color: #3A2B35;
		fill: #3A2B35;
	}


	.arrow {
		width: 0.6rem;
	}

    @media (max-width: 1140px) {
        .submit_button {
            font-size: 1.1rem;
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