<script lang="ts">
	import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import LoginBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan.jpg';
    import AdminLoginPanel from '$lib/components/logins/LoginAdmin.svelte';
</script>
<svelte:head>
	<title>login administrator - public arts commission</title>
	<meta name="description" content="log into public arts commission administrator account" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<section>
    <div 
		class="login_container"
		style="background-image: url({LoginBackground});"
	>
		<div class="login_section">
			<AdminLoginPanel />
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