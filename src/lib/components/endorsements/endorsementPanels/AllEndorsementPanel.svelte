<script lang="ts">
    import EndorsementCategories from '$lib/components/endorsements/endorsementsCategories/EndorsementCategories.svelte';
    export let panel_data: Endorsements;

</script>
<div class="endorsement_categories_container">
    <EndorsementCategories categories_data={panel_data}/>
</div>

<style>

    .endorsement_categories_container {
        position: relative;
    }
    
</style>