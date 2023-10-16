<script lang="ts">
    import Arrow from '$lib/images/icons/arrow.svg';

    export let open: boolean = false;

    const handleClick = () => {

        open = !open
    };

</script>

<div class="accordion">
    <div 
        id="head"
        aria-controls="details"
        tabindex={1}
        role="tab"
        class={open ? "headActive" : "head"}
        on:click={handleClick}
        on:keyup={handleClick}
    >
        <slot name="head" />
        <div class={open ? "arrow_active" : "arrow"}>
            <img src={Arrow} alt="arrow icon" />
        </div>
    </div>
    
    {#if open}
        <div 
            class="details"
            id="details"
            role="tabpanel"
            tabindex={-1}
            aria-labelledby="head"
        >
            <slot name="details" />
        </div>
    {/if}
</div>
<style>

    .head {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        cursor: pointer;
        transition: color 0.2s linear;
        gap: 1rem;
    }

    .head:hover {
        color: #28387C;
    }

    .headActive {
        color: #4C4239;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        cursor: pointer;
        transition: color 0.2s linear;
        gap: 1rem;
    }

    .headActive:hover {
        color: #28387C;
    }

    .details {
        padding: 1rem;
        font-size: 1.5rem;
    }

    .arrow {
        max-width: 1.5rem;
        width: 100%;
        transform: rotateX(0) rotate(90deg);
        will-change: transform;
        transition: transform 0.2s ease-out;
    }

    .arrow_active {
        max-width: 1.5rem;
        width: 100%;
        transform: rotateX(180deg) rotate(90deg);
        will-change: transform;
        transition: transform 0.2s ease-out;
    }
</style>