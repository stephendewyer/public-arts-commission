<script lang="ts">
    import ActionButton from "$lib/components/buttons/ActionButton.svelte";

</script>

<div class="page" id="page_container">
    <h1>
        Please excuse our appearence while this page is under construction.
    </h1>
    <h2>
        Our endorsements:
    </h2>
    <ul class="endorsement_categories" >
        
        <li>
            <a href="/endorsements/candidates-endorsed">
                <ActionButton>
                    candidates
                </ActionButton>
            </a>
        </li>
        <li>
            <a href="/endorsements/legislation-endorsed">
                <ActionButton>
                    legislation
                </ActionButton>
            </a>
        </li>
        <li>
            <a href="/endorsements/referendums-endorsed">
                <ActionButton>
                    referendums
                </ActionButton>
            </a>
        </li>
        <li>
            <a href="/endorsements/amendments-endorsed">
                <ActionButton>
                    amendments
                </ActionButton>
            </a>

        </li>
        <li>
            <a href="/endorsements/actions-endorsed">
                <ActionButton>
                    actions
                </ActionButton>
            </a>
        </li>
    </ul>
</div>

<style>
    #page_container {
        width: 100%;
        max-width: 80rem;
        padding: 0 1rem;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        margin: 0 auto;
    }
    .endorsement_categories {
        list-style: none;
        margin: 0;
        padding: 0;
    }

</style>