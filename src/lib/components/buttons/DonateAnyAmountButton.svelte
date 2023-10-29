<script lang="ts">

    export let anyAmountClicked: boolean = false;

    export let activatedIndex: number = 0;

    const anyAmountClickHandler = () => {
        if (anyAmountClicked)
        anyAmountClicked = !anyAmountClicked;
        activatedIndex = 7;
    }

</script>

<button 
    class={ activatedIndex === 7 ? "donate_amount_button_active" : "donate_amount_button" }
    on:click={() => anyAmountClickHandler()}
    on:keyup={() => anyAmountClickHandler()}
>
    <p>$</p><input />
</button>

<style>
    .donate_amount_button {
		color: #4C4239;
		fill: #4C4239;
		background-color: #D8EAC5;
		border: solid 3px #4C4239;
		padding: 0.5rem 1rem;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
        will-change: color, background-color;
		transition: background-color 0.2s linear, color 0.2s linear;
    }

    .donate_amount_button_active {
		color: #D8EAC5;
		fill: #4C4239;
		background-color: #4C4239;
		border: solid 3px #4C4239;
		padding: 0.5rem 1rem;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
        will-change: color, background-color;
		transition: background-color 0.2s linear, color 0.2s linear;
    }
</style>