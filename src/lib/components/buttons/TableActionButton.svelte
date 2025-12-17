<script lang="ts">
    import Arrow from '$lib/images/icons/arrow.svg?raw';

</script>

<button class="table_action_button">
    <slot />
    <div class="arrow">
        {@html Arrow}
    </div>
</button>

<style>

    .table_action_button {
        margin: 0 auto;
		color: #4C4239;
		fill: #4C4239;
        background-color: transparent;
		border: solid 3px #4C4239;
		padding: 0.5rem 1rem;
		gap: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 3rem;
		cursor: pointer;
		transition: color 0.2s linear, fill 0.2s linear, border-color 0.2s linear;
        overflow-wrap: normal;
        hyphens: none;
        white-space: none;
	}

	.table_action_button:hover {
		color: #28387C;
        fill: #28387C;
        border-color: #28387C;
	}

	.arrow {
		width: 0.6rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
	}

    @media (max-width: 1140px) {
        .table_action_button {
            font-size: 0.9rem;
        }

        .arrow {
            width: 0.5rem;
        }
	}

	@media (max-width: 720px) {
        .table_action_button {
            font-size: 0.8rem;
        }

        .arrow {
            width: 0.4rem;
        }
	}
</style>