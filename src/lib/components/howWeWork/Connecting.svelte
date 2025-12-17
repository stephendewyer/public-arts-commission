<script lang="ts">
    import HowWeWorkPanel from '$lib/components/howWeWork/HowWeWorkPanel.svelte';
    import Bridge from '$lib/images/process/bridge.png';

</script>

<HowWeWorkPanel>
    <img 
        slot="process_image"
        src={Bridge} 
        alt="bridge connecting supporters and campaigns" 
    />
    <p
        slot="process_paragraphs"
    >
        Connect political campaigns that advance public arts commission values with supporters
    </p>
</HowWeWorkPanel>

<style>

</style>