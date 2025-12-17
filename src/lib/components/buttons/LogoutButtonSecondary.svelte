<script lang="ts">
    import LogoutIcon from "$lib/images/icons/logout_icon.svg?raw";
    import { goto } from "$app/navigation";

    export let logoutAPIroute: string = "";
    export let callbackUrl: string = "";

    const logoutHandler = async () => {
        await fetch(logoutAPIroute, {
            method: "POST"
        });
        goto(callbackUrl);
    };

</script>

<button 
    on:click={logoutHandler}
    class="submit_button"
>
    <div class="logout_icon">
        {@html LogoutIcon}
    </div>
    <slot />
</button>

<style>

    .submit_button {
        margin: 0 auto auto 1rem;
        height: auto;
		color: #E3CDB2;
		fill: #E3CDB2;
		background-color: transparent;
		border: none;
		padding: 0.5rem 1rem;
		gap: 0.5rem;
		font-size: 1.25rem;
		font-weight: 400;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 3rem;
		cursor: pointer;
        transition: color 0.2s linear, fill 0.2s linear;
	}

	.submit_button:hover {
		color: #DEF2F4;
		fill: #DEF2F4;
	}

    .logout_icon {
        width: 1.25rem;
    }

</style>