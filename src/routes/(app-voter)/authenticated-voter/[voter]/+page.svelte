<script lang="ts">
    
    export let data;

    $: data;

    let userEmail = data.streamed.user?.email;

</script>

<h1>voter email is {userEmail}</h1>
