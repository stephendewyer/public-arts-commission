<script lang="ts">
	import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import LoginBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan.jpg';
    import VoterLoginPanel from '$lib/components/logins/LoginVoter.svelte';
</script>
<svelte:head>
	<title>login voter - public arts commission</title>
	<meta name="description" content="log into public arts commission voter account" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<section>
    <div 
		class="login_container"
		style="background-image: url({LoginBackground});"
	>
		<div class="login_section">
            <h1>voter login</h1>
			<VoterLoginPanel />
		</div>
	</div>
</section>

<style>
    .login_container {
		width: 100%;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
		background-repeat: no-repeat;
		background-position: center;
	}

	.login_section {
		background-color: rgba(239,249,242,0.7);
		max-width: 40rem;
		width: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>