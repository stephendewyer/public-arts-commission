<script lang="ts">
    // import { page } from '$app/stores';

    export let mobileNavTabsData;

    console.log(mobileNavTabsData);

    $: activeTab = false;

</script>

<nav>
    {#each mobileNavTabsData as mobileNavTab, index}
        <li>{mobileNavTab.label}</li>
    {/each}
</nav>

<style>

    nav {
        width: 100%;
        padding: 4rem 2rem;
	}

</style>