<script lang="ts">

</script>

<button class="cancel_button">
    <div class="arrow">
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 329.46 500">
            <defs>
              <style>
                .cls-6 {
                  fill: inherit;
                  stroke-width: 0px;
                }
              </style>
            </defs>
            <polygon class="cls-6" points="329.46 250 103.48 500 0 500 225.98 250 0 0 103.48 0 329.46 250"/>
          </svg>
    </div>
    <slot />
</button>

<style>

    .cancel_button {
            font-size: 1rem;
            background: transparent;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
            border: 2px solid #1C2226;
            outline: none;
            border-radius: 3rem;
            color: #1C2226;
            transition: gap 0.2s ease-out;
            padding: 0.5rem 1rem;
            cursor: pointer;
            fill: #1C2226;
            margin: 0.5rem auto;
    }
    
    .arrow {
        width: 100%;
		max-width: 0.4rem;
        transform: rotate(180deg);
        display: flex;
        flex-direction: column;
        justify-content: center;
	}

    .cancel_button:hover {
        gap: 1rem;
    }

    @media (max-width: 1140px) {
        .cancel_button {
            font-size: 0.9rem;
        }

        .arrow {
            max-width: 0.4rem;
        }
	}

	@media (max-width: 720px) {
        .cancel_button {
            font-size: 0.8rem;
        }

        .arrow {
            max-width: 0.3rem;
        }
	}
</style>