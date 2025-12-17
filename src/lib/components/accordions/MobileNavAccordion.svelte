<script lang="ts">
    
    import MobileNavAccordionItem from './MobileNavAccordionItem.svelte';

    export let openState: boolean;

    export let mobileNavTabsData: AccordionTab[];

    let activeTab: number = -1;
    let setActiveIndex: number = -1;
    let setIsActive: boolean = false;

    $: setIsActive;

    $: activeTab = setActiveIndex;

</script>

<ul>
    {#each mobileNavTabsData as mobileNavTab, index}
        <MobileNavAccordionItem 
            item={mobileNavTab}
            bind:open={openState}
            bind:setActive={setIsActive}
            bind:setActiveIndex={setActiveIndex}
            activeTab={activeTab}
            index={index}
        />
    {/each}
</ul>

<style>

    ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

</style>