<script lang="ts">
    import LoginBackground from '$lib/images/11_December_2012_take_Lansing,_Michigan.jpg';
    import CampaignLoginPanel from '$lib/components/logins/LoginCampaign.svelte';
</script>

<section>
    <div 
		class="login_container"
		style="background-image: url({LoginBackground});"
	>
		<div class="login_section">
            <h1>campaign login</h1>
			<CampaignLoginPanel />
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