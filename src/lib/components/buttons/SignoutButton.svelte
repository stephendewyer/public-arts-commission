<script lang="ts">
    import { signOut } from "@auth/sveltekit/client";
    import LogoutIcon from "$lib/images/icons/logout_icon.svg?raw";
    export let callbackUrl: string;

</script>

<button 
    on:click={() => signOut({
        redirect: true,
        callbackUrl: `${callbackUrl}`
    })}
    class="submit_button"
>
    <div class="logout_icon">
        {@html LogoutIcon}
    </div>
    <slot />
</button>

<style>

    .submit_button {
        margin: 1rem auto;
		color: #4C4239;
		fill: #4C4239;
		background-color: #D8EAC5;
		border: solid 3px #4C4239;
		padding: 0.5rem 1rem;
		gap: 0.5rem;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 3rem;
		cursor: pointer;
	}

	.submit_button:hover {
		background-color: #E3CDB2;
	}

    .logout_icon {
        width: 1.5rem;
    }

    @media (max-width: 1140px) {
        .submit_button {
            font-size: 1.25rem;
        }

	}

	@media (max-width: 720px) {
        .submit_button {
            font-size: 1rem;
        }

	}
</style>