<script>
	export let open = false;
</script>

<button 
	class="hamburger" 
	class:open 
	on:click={() => open = !open}
	aria-pressed={open}
	aria-label="toggle sidedrawer navigation"
>
    <svg width=32 height=24>
        <line id="top" x1=0 y1=2  x2=32 y2=2/>
        <line id="middle" x1=0 y1=12 x2=32 y2=12/>
        <line id="bottom" x1=0 y1=22 x2=32 y2=22/>
    </svg>
</button>

<style>

    button {
		z-index: 51;
        position: relative;
	}

    .hamburger {
        cursor: pointer;
        border: none;
        outline: none;
        position: relative;
        background: none;
    }

    .hamburger:focus {
        outline: none;
    }

	svg {
		min-height: 28px;
		transition: transform 0.3s ease-in-out;
	}
	
	svg line {
		stroke: #4c4239;
		stroke-width: 3;
		transition: transform 0.3s ease-in-out, stroke 0.3s ease-in-out;
	}
	
	.open svg {
		transform: scale(1)
	}

	.open > svg line {
		stroke: #d8eac5;
	}

	.open:hover > svg line {
		stroke: #E3CDB2;
	}
	
	.open #top {
		transform: translate(6px, 0px) rotate(45deg)
	}
	
	.open #middle {
		opacity: 0;
	}
	
    .open #bottom {
		transform: translate(-12px, 9px) rotate(-45deg)
	}

</style>