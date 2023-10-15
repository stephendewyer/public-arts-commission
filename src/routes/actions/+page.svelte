<script lang="ts">

    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    import ProposeActionButton from '$lib/components/buttons/NominateButton.svelte';

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

<div class="actions">
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
            <ProposeActionButton>
                propose an action
            </ProposeActionButton>
        </li>
        <li class="actions_history_container">
            <h3>
                actions history
            </h3>
        </li>
    </ul>
</div>

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