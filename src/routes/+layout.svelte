<script>
	import MainHeader from '$lib/components/MainHeader.svelte';
	import MainFooter from '$lib/components/MainFooter.svelte';
	import SideDrawer from '$lib/components/navigation/sideDrawer/SideDrawer.svelte';
	import Backdrop from '$lib/components/navigation/sideDrawer/Backdrop.svelte';
	import './styles.css';

	let open = false;

	let footerElHeight = 0;
</script>

<div class="app">
	<MainHeader bind:sideDrawer={open}/>

	<main style="padding-bottom: {footerElHeight}px">
		<slot />
	</main>

	<MainFooter bind:footerHeight={footerElHeight}/>
	{#if (open)}
		<Backdrop bind:open />
	{/if}
	<SideDrawer bind:open />
	<!-- {#if (TeamMemberOpen)}
		<Backdrop bind:TeamMemberOpen />
	{/if} -->
</div>

<style>

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
	}

	main {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
	}

</style>
