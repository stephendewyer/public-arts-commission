<script lang="ts">
    import MeatBalls from '$lib/images/icons/meaballs.svg?raw';
</script>

<div
    class="button_container"
>
    {@html MeatBalls}
</div>

<style>

    .button_container {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        height: 2.5rem;
        width: 2.5rem;
        text-align: center;
        padding: 0.4rem;
        min-width: 1rem;
        font-size: 1.75rem;
        margin: 0;
    }

    .button_container:hover {
        box-shadow:
            0 1px 1px hsl(0deg 0% 0% / 0.075),
            0 2px 2px hsl(0deg 0% 0% / 0.075),
            0 4px 4px hsl(0deg 0% 0% / 0.075),
            0 8px 8px hsl(0deg 0% 0% / 0.075),
            0 16px 16px hsl(0deg 0% 0% / 0.075)
        ;
        cursor: pointer;
        color: #28387C;
        fill: #28387C;
    }

    @media (max-width: 1140px) {
        .button_container {
            height: 2.125rem;
            width: 2.125rem;
            padding: 0.5rem;
        }
	}

	@media (max-width: 720px) {
        .button_container {
            height: 1.75rem;
            width: 1.75rem;
            padding: 0.4rem;
            min-width: 1rem;
        }
	}

</style>