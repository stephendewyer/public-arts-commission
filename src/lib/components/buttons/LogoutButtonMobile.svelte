<script lang="ts">
    import { signOut } from "@auth/sveltekit/client";
    import LogoutIcon from "$lib/images/icons/logout_icon.svg?raw";
    export let callbackUrl: string;

    export let openState: boolean;

    const logoutClickHandler = () => {

        openState = !openState;
        signOut({
            redirect: true,
            callbackUrl: `${callbackUrl}`
        });

    };

</script>

<button 
    on:click={logoutClickHandler}
    class="mobile_nav_tab"
>
    <div class="logout_icon">
        {@html LogoutIcon}
    </div>
    <slot />
</button>

<style>

    .mobile_nav_tab {
        background-color: transparent;
        color: #D8EAC5;
        fill: #D8EAC5;
        width: 100%;
        cursor: pointer;
        border-color: #D8EAC5;
        border-width: 2px;
        border-style: solid;
        text-decoration: none;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: color 0.2s linear, fill 0.2s linear, border-color 0.2s linear;
    }

    .mobile_nav_tab:hover {
        color: #E3CDB2;
        fill: #E3CDB2;
        border-color: #E3CDB2;
    }

    .logout_icon {
        width: 1rem;
    }

</style>