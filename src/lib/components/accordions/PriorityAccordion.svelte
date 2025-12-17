<script lang="ts">
    import Arrow from '$lib/images/icons/arrow.svg';

    export let open: boolean = false;

    const handleClick = () => {

        open = !open
    };

    let height: number = 0;

    $: height;

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
        <h3 class="heading">
            <slot name="head" />
        </h3>
        <div class={open ? "arrow_active" : "arrow"}>
            <img src={Arrow} alt="arrow icon" />
        </div>
    </div>
    <div 
        class="details_container"
        id="details"
        role="tabpanel"
        tabindex={-1}
        aria-labelledby="head"
        style={ open ? `height: ${height}px` : 'height: 0px;' }
    >
        <div 
            class="detail"
            bind:clientHeight={height}
            style={ open ? "opacity: 100%;" : "opacity: 0;" }
        >
            <slot name="details" />
        </div>
    </div>
</div>
<style>

    .accordion {
        margin: 0;
    }

    .head {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        cursor: pointer;
        transition: color 0.2s linear;
        padding-right: 2rem;
    }

    .head:hover {
        color: #28387C;
    }

    .headActive {
        position: relative;
        color: #4C4239;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        cursor: pointer;
        transition: color 0.2s linear;
        padding-right: 2rem;
    }

    .headActive:hover {
        color: #28387C;
    }

    .heading {
        position: relative;
        padding-right: 2rem;
    }

    .arrow {
        position: relative;
        width: 1.5rem;
        min-width: 1.5rem;
        transform: rotateX(0) rotate(90deg);
        will-change: transform;
        transition: transform 0.2s ease-out;
    }

    .arrow_active {
        position: relative;
        width: 1.5rem;
        min-width: 1.5rem;
        transform: rotateX(180deg) rotate(90deg);
        will-change: transform;
        transition: transform 0.2s ease-out;
    }

    .details_container {
        overflow: hidden;
        will-change: height;
        transition: height 0.4s cubic-bezier(0.65, 0.05, 0.36, 1);
    }

    .detail {
        padding: 1rem 2rem 1rem 0;
        font-size: 1.5rem;
        will-change: opacity;
        transition: opacity 0.4s ease-out;
    }

    @media (max-width: 1440px) {
        .detail {
            font-size: 1.25rem;
        }

        .arrow {
            width: 1.25rem;
            min-width: 1.25rem;
        }

        .arrow_active {
            width: 1.25rem;
            min-width: 1.25rem;
        }

        .heading {
            font-size: 1.25rem;
        }
    }
  
    @media (max-width: 720px) {
        .detail {
            font-size: 1rem;
        }

        .arrow {
            width: 1rem;
            min-width: 1rem;
        }

        .arrow_active {
            width: 1rem;
            min-width: 1rem;
        }

        .heading {
            font-size: 1rem;
        }
    }

</style>