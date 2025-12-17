<script lang="ts">
    export let tabPanels: tabPanels[];
    export let activeTab: number = 0;
    export let endorsementNavHeight: number = 0;
    // $: console.log(tabPanels);

</script>

{#each tabPanels as tabPanel, i}
    {#if activeTab === tabPanel.index}
        <svelte:component 
            this={tabPanel.panel} 
            id={`${tabPanel.label}_tabpanel`}
            role="tabpanel"
            tabindex={-i}
            aria-labelledby={`tabpanel_header_${tabPanel.label}`}
            panel_data={tabPanel.data}
            endorsementNavHeight={endorsementNavHeight}
        />
    {/if}
{/each}