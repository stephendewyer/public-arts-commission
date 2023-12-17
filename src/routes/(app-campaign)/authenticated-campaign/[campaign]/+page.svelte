<script lang="ts">

    export let data;

    $: data;

    let campaignEmail = data.streamed.user?.email
    
</script>

<h1>campaign email is {campaignEmail}</h1>
