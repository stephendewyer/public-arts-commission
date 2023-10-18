<script lang="ts">
    import HowWeWorkPanel from '$lib/components/howWeWork/HowWeWorkPanel.svelte';
    import Platform from '$lib/images/process/platform.png';

</script>

<HowWeWorkPanel>
    <img 
        slot="process_image"
        src={Platform} 
        alt="platform" 
    />
    <p
        slot="process_paragraphs"
    >
        Advance legislation that aligns with the public arts commission mission
    </p>
</HowWeWorkPanel>

<style>

</style>