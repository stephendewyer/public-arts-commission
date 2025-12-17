<script lang="ts">
    import Arrow from "$lib/images/icons/arrow.svg?raw";

</script>

<button class="cancel_button" type="button">
    <div class="arrow">
        {@html Arrow}
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