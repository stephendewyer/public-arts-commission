<script lang="ts">
    import { goto } from "$app/navigation";
    import LogoutIcon from "$lib/images/icons/logout_icon.svg?raw";
    
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
        margin: 1rem 1rem auto auto;
        height: auto;
		color: #4C4239;
		fill: #4C4239;
		background-color: transparent;
		border: none;
		padding: 0.5rem 1rem;
		gap: 0.5rem;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 3rem;
		cursor: pointer;
        transition: color 0.2s linear, fill 0.2s linear;
	}

	.submit_button:hover {
		color: #3A2B35;
		fill: #3A2B35;
	}

    .logout_icon {
        width: 1.5rem;
    }

    @media (max-width: 1140px) {
        .submit_button {
            font-size: 1.25rem;
        }

        .logout_icon {
            width: 1.25rem;
        }

	}

	@media (max-width: 720px) {
        .submit_button {
            font-size: 1rem;
        }

        .logout_icon {
            width: 1rem;
        }

	}
</style>