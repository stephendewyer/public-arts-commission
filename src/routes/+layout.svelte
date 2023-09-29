<script>
	import MainHeader from '$lib/components/MainHeader.svelte';
	import MainFooter from '$lib/components/MainFooter.svelte';
	import './styles.css';
</script>

<div class="app">
	<MainHeader />

	<main>
		<slot />
	</main>

	<MainFooter />
</div>

<style>

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

</style>
