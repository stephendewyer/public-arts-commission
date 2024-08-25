<script lang="ts">
    import EndorsementCategories from '$lib/components/endorsements/endorsementsCategories/EndorsementCategories.svelte';
    export let panel_data: Endorsements;
    export let endorsementNavHeight: number = 0;
</script>
<div class="endorsement_categories_container">
    <EndorsementCategories 
        categories_data={panel_data}
        endorsementNavHeight={endorsementNavHeight}
    />
</div>

<style>

    .endorsement_categories_container {
        position: relative;
    }
    
</style>