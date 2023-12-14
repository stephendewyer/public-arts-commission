<script lang="ts">
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    import ProposeActionButton from '$lib/components/buttons/NominateButton.svelte';
    import type { User } from '@auth/core/types.js';
    import ActionEndorsementCard from '$lib/components/cards/endorsementCards/ActionEndorsementCard.svelte';

    export let data;

    $: data;

    const user: User | undefined = data.streamed.user;

    const endorsedActions = data.streamed.endorsed_actions;

    const endorsedActionsImages = data.streamed.endorsed_actions_images;

    let endorsedActionsWithImages: ActionWithImage[] = [];

    endorsedActions.forEach((action: Action) => {
        let actionImageId = action.image_ID;

        endorsedActionsImages.forEach((imageRow: Image) => {
            if (actionImageId === imageRow.image_ID) {
                endorsedActionsWithImages.push({...action, ...imageRow});
            };
        });
    });

    let searchValue: string;

    let disableButton: boolean = true;

    const searchInputValueChangeHandler = () => {

        if (searchValue !== "" ) {
            disableButton = false;
        } else if (searchValue == "") {
            disableButton = true;
        }
    }

        const searchSubmitHandler = () => {

    }

</script>

<section class="actions">
    <form 
        class="actions_search_form"
        on:submit|preventDefault={searchSubmitHandler}
    >
        <h1>
            search actions by name, date or location
        </h1>
        <div class="search_endorsements_by_address_input">
            <SearchInput 
                placeholder="1000 MyStreet, MyCity, MyState  10000"
                inputID="address"
                inputName="address"
                inputLabel={false}
                bind:searchInputValue={searchValue}
                searchInputValueChange={() => searchInputValueChangeHandler()}
            />
        </div>
        <ActionButton
			bind:disable={disableButton}
		>
			search actions
		</ActionButton>
    </form>
    <ul class="actions_categories_container">
        <li class="forthcoming_actions_container">
            <h3>
                forthcoming actions
            </h3>
            {#each endorsedActionsWithImages as endorsedAction, i}
                <ActionEndorsementCard endorsedActionData={endorsedAction} />
            {/each}
            
            <ProposeActionButton
                category="actions" 
                authorized_user={user}
            >
                propose an action
            </ProposeActionButton>
        </li>
        <li class="actions_history_container">
            <h3>
                actions history
            </h3>
        </li>
    </ul>
</section>

<style>

    .actions {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .actions_search_form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 40rem;
        padding: 0 1rem 1rem 1rem;

    }

    .search_endorsements_by_address_input {
        width: 100%;
    }

    .actions_categories_container {
        list-style: none;
        padding: 2rem 0 0 0;
        margin: 0;
        width: 100%;
    }

    .forthcoming_actions_container {
        background-color: #F4F5FB;
        padding: 1rem;
    }

    .actions_history_container {
        background-color: #CBC6C2;
        padding: 1rem;
    }

</style>