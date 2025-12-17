<script lang="ts">
	import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import UpdateBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan.jpg';
	import PasswordUpdateVoter from '$lib/components/passwordUpdates/PasswordUpdateVoter.svelte';

	/** @type {import('./$types').PageData} */
	export let data: any;

	const paramsTokenID = data.tokenID;

</script>
<svelte:head>
	<title>update voter password - public arts commission</title>
	<meta name="description" content="update voter password" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<section>
    <div 
		class="update_container"
		style="background-image: url({UpdateBackground});"
	>
		<div class="update_section">
            <h1>update password</h1>
            <h2>voter</h2>
			<PasswordUpdateVoter paramsTokenID={paramsTokenID}/>
		</div>
	</div>
</section>

<style>
    .update_container {
		width: 100%;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
		background-repeat: no-repeat;
		background-position: center;
	}

	.update_section {
		background-color: rgba(239,249,242,0.7);
		max-width: 40rem;
		width: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
