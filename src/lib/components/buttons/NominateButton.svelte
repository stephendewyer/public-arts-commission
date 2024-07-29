<script lang="ts">
  import NominateIcon from "$lib/images/icons/nominate_icon.svg?raw";
  import { CreateVoterAccountPromptStore } from "$lib/stores/CreateVoterAccountPromptStore";
  import { ModalOpenStore } from "$lib/stores/ModelOpenStore";
  import type { User } from '@auth/core/types.js';

  export let category: string | any = "";

  export let authorized_user: User | undefined;

  const nominateButtonClickHandler = () => {

    // console.log(authorized_user)

    if (!authorized_user?.name) {

        CreateVoterAccountPromptStore.update((value) => value = category);

        ModalOpenStore.update((value) => value = !value);

    };

  };

</script>

<button 
    on:click={nominateButtonClickHandler}
    on:keydown={nominateButtonClickHandler}
    class="nominate_button"
>
    <div class="megaphone_icon">
        {@html NominateIcon}
    </div>
    <slot />
</button>

<style>

    .nominate_button {
        background-color: #D8EAC5;
        color: #4C4239;
        border: 3px solid #4C4239;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 1.2rem;
        font-weight: 600;
        width: 100%;
        max-width: 10rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        transition: background-color 0.2s linear;
        cursor: pointer;
        pointer-events: all;
    }

    .nominate_button:hover {
        background-color: #E3CDB2;
    }

    .megaphone_icon {
        width: 100%;
        max-width: 2rem;
        fill: #4C4239;
    }

    @media (max-width: 1140px) {
        .nominate_button {
            border: 2px solid #4C4239;
            font-size: 1rem;
            max-width: 8rem;
            padding: 0.4rem 0.75rem;
        }

        .megaphone_icon {
            max-width: 1.75rem;
        }
	}

	@media (max-width: 720px) {
        .nominate_button {
            font-size: 0.8rem;
            max-width: 6rem;
            padding: 0.25rem 0.5rem;
        }

        .megaphone_icon {
            max-width: 1.5rem;
        }
	}

</style>