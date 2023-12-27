<script lang="ts">
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    import ProposeActionButton from '$lib/components/buttons/NominateButton.svelte';
    import type { User } from '@auth/core/types.js';
    import ActionEndorsementCard from '$lib/components/cards/endorsementCards/ActionEndorsementCard.svelte';

    export let data;

    $: data;

    const user: User | undefined = data.streamed.user;

	let endorsedActions: ActionWithImage[] = [];

    $: endorsedActions = [...data.streamed.endorsed_actions];

    // load all the future actions

	let futureEndorsedActions: ActionWithImage[] = [];

    let pastEndorsedActions: ActionWithImage[] = [];

    const currentDate = new Date();

    $: endorsedActions.forEach((action: ActionWithImage) => {

        const actionEndDate = new Date(action.date_end);
        const actionAllDayDate = new Date(action.all_day_event_date);

        if ((actionEndDate >= currentDate) || (actionAllDayDate >= currentDate)) {

            futureEndorsedActions = [...futureEndorsedActions, action];
            
        } else {

            pastEndorsedActions = [...pastEndorsedActions, action]

        };
    });

    let searchValue: string;

    let disableButton: boolean = true;

    const searchInputValueChangeHandler = () => {

        if (searchValue !== "" ) {

            disableButton = false;

        } else if (searchValue == "") {

            disableButton = true;
        };
    };

        const searchSubmitHandler = () => {

    };

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
            {#each futureEndorsedActions as endorsedAction, i}
                <ActionEndorsementCard endorsedActionData={endorsedAction} />
            {/each}
            <div class="propose_an_action_button_container">
                <ProposeActionButton
                    category="actions" 
                    authorized_user={user}
                >
                    propose an action
                </ProposeActionButton>
            </div>
        </li>
        <li class="actions_history_container">
            <h3>
                actions history
            </h3>
            {#each pastEndorsedActions as endorsedAction, i}
                <ActionEndorsementCard endorsedActionData={endorsedAction} />
            {/each}
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
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .actions_history_container {
        background-color: #CBC6C2;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .propose_an_action_button_container{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 100%;
    }

</style>