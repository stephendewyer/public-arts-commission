<script lang="ts">
    import EndorsementCategories from '$lib/components/endorsements/endorsementsCategories/EndorsementCategories.svelte';
    export let panel_data: any[];

    $: panel_data;

</script>
<div>
    <EndorsementCategories categories_data={panel_data}/>
</div>

<style>
    
</style>