<script lang="ts">
    export let tabPanels: tabPanels[];
    export let activeTab: number;
    export let selectedItemId: number | null;
    
</script>

{#each tabPanels as tabPanel, i}
    {#if activeTab === tabPanel.index}
        <svelte:component 
            this={tabPanel.panel} 
            id={`${tabPanel.label}_tabpanel`}
            role="tabpanel"
            tabindex={-i}
            aria-labelledby={`tabpanel_header_${tabPanel.label}`}
            bind:selectedItem={selectedItemId}
        />
    {/if}
{/each}