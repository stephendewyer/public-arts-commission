<script>
	import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    export let data;

	// console.log(data);
</script>

<svelte:head>
	<title>public arts commission - welcome</title>
	<meta name="description" content="public arts commission index" />
</svelte:head>

<section>
	<p>
		{#each data.data as voter}
			{voter.email}
		{/each}
	</p>
	<picture class="banner">
		<img src={PublicArtsCommissionBanner} alt="public arts commission banner" />
	</picture>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.banner {
		width: 100%;
		max-width: 60rem;
		padding: 1rem 0;
	}

</style>
