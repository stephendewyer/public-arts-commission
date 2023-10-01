<script>
    export let open = false;
</script>

<div 
    class="backdrop"
    on:click={() => open = !open} 
    on:keydown={() => open = !open}
    aria-hidden={!open}
/>

<style>
    .backdrop {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        background: #000000;
        opacity: 50%;
        cursor: pointer;
    }

    @media (min-width: 1140px) {

        .backdrop {
            display: none;
        }

    }
</style>