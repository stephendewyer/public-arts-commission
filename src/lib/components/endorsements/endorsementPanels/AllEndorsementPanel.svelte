<script lang="ts">
    import EndorsementCategories from '$lib/components/endorsements/endorsementsCategories/EndorsementCategories.svelte';

    let { panel_data, endorsementNavHeight }: { panel_data: Endorsements, endorsementNavHeight: number } = $props();

</script>
<div 
    class="endorsement_categories_container"
>
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