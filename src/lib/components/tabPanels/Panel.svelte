<script lang="ts">
    export let tabPanels: tabPanels[];
    export let activeTab: number;
    export let campaignLoginClicked: string;
    export let voterLoginClicked: string;
</script>

{#each tabPanels as tabPanel, i}
    {#if activeTab === tabPanel.index}
        <svelte:component 
            bind:campaignLoginClicked={campaignLoginClicked}
            bind:voterLoginClicked={voterLoginClicked}
            this={tabPanel.panel} 
            id="{tabPanel.label}_tabpanel"
            role="tabpanel"
            tabindex={-i}
            aria-labelledby="tabpanel_header_{tabPanel.label}"
        />
    {/if}
{/each}

<style>
    
    
</style>