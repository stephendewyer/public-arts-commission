<script lang="ts">
    import Arrow from "$lib/images/icons/arrow.svg?raw";

    export let clicked: boolean = false;

    export let disabled: boolean = false;

</script>
<button 
    id="previous_button"
    type="button"
    class={disabled ? "disabled" : "active"}
    on:click={() => clicked = true}
    on:keyup={() => clicked = true}
>
    <div class="arrow_left">
        {@html Arrow}
    </div>
</button>
<style>

    #previous_button {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        height: 3rem;
        width: 3rem;
        text-align: center;
        margin: 0.5rem;
        min-width: 1rem;
        font-size: 1.75rem;
        line-height: 2.75rem;
        transition: box-shadow 0.3s linear, fill 0.3s linear;
    }

    #previous_button:hover {
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

    .arrow_left {
        display: flex;
        width: 0.75rem;
        height: auto;
        transform: rotate(180deg);
    }

    .disabled {
        pointer-events: none;
        color: rgba(224,217,217,0.5);
    }

    .disabled > .arrow_left {
        fill: rgba(33,33,33,0.5);
    }

    .disabled:hover {
        background-color: transparent;
        cursor: default;
    }

    @media all and (max-width:720px){

        #previous_button {
            height: 2rem;
            width: 2rem;
        }

        .arrow_left {
            display: flex;
            width: 0.5rem;
            height: auto;
        }

    }
    
</style>