<script>
    import { page } from '$app/stores';

    const today = new Date();
    const year = today.getFullYear();
    export let footerHeight;

</script>

<footer bind:clientHeight={footerHeight}>

</footer>

<style>

    footer {
        position: absolute;
        bottom: 0;
        width: 100%;
    }

</style>