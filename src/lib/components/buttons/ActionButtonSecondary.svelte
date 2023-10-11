<script>

</script>

<button class="submit_button">
    <slot />
    <div class="arrow">
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 329.46 500">
            <defs>
              <style>
                .cls-7 {
                  fill: inherit;
                  stroke-width: 0px;
                }
              </style>
            </defs>
            <polygon class="cls-7" points="329.46 250 103.48 500 0 500 225.98 250 0 0 103.48 0 329.46 250"/>
          </svg>
    </div>
</button>

<style>

    .submit_button {
        margin: 1rem;
		color: #4C4239;
		fill: #4C4239;
		background-color: transparent;
		border: none;
		padding: 0.5rem 1rem;
		gap: 0.25rem;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 3rem;
		cursor: pointer;
		transition: gap 0.2s ease-out, fill 0.2s linear, color 0.2s linear;
	}

	.submit_button:hover {
		gap: 0.75rem;
        color: #3A2B35;
		fill: #3A2B35;
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