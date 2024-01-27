<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';

    export let data;

    $: data;

    let userEmail = data.streamed.user?.email;

</script>
<svelte:head>
	<title>public arts commission - voter dashboard</title>
	<meta name="description" content="voter dashboard" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<h1>voter email is {userEmail}</h1>
