<script lang="ts">
    import ResetPasswordBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan.jpg';
    import ResetPasswordVoterPanel from '$lib/components/passwordResets/PasswordResetVoter.svelte';
</script>

<section>
    <div 
		class="reset_container"
		style="background-image: url({ResetPasswordBackground});"
	>
		<div class="reset_section">
			<ResetPasswordVoterPanel />
		</div>
	</div>
</section>

<style>
    .reset_container {
		width: 100%;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
		background-repeat: no-repeat;
		background-position: center;
	}

	.reset_section {
		background-color: rgba(239,249,242,0.7);
		max-width: 40rem;
		width: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>