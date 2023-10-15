<script lang="ts">
    import NominateButton from '$lib/components/buttons/NominateButton.svelte';
</script>

<ul class="endorsement_categories_container">
    <li class="candidates_container">
        <h3>
            candidates
        </h3>
        <NominateButton>
            nominate a candidate
        </NominateButton>
    </li>
    <li class="referendums_container">
        <h3>
            referendums
        </h3>
        <NominateButton>
            nominate an initiative
        </NominateButton>
    </li>
    <li class="legislation_container">
        <h3>
            legislation
        </h3>
        <NominateButton>
            nominate a bill
        </NominateButton>
    </li>
    <li class="amendments_container">
        <h3>
            amendments
        </h3>
        <NominateButton>
            nominate an amendment
        </NominateButton>
    </li>
</ul>

<style>

    .endorsement_categories_container {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .candidates_container {
        background-color: #FBEFF6;
        padding: 1rem;
    }

    .referendums_container {
        background-color: #CBC6C2;
        padding: 1rem;
    }

    .legislation_container {
        background-color: #F8FAF7;
        padding: 1rem;
    }

    .amendments_container {
        background-color: #F4F4DB;
        padding: 1rem;
    }

    @media (max-width: 1140px) {

	}

	@media (max-width: 720px) {
        
	}

</style>