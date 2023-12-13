<script lang="ts">
    import EndorsementCategories from '$lib/components/endorsements/endorsementsCategories/EndorsementCategories.svelte';
    export let panel_data: any[];
    
</script>
<div>
    <EndorsementCategories categories_data={panel_data}/>
</div>

<style>
    
</style>