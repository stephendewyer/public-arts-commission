<script lang="ts">
    import HowWeWorkPanel from '$lib/components/howWeWork/HowWeWorkPanel.svelte';
    import Lobbying from '$lib/images/process/legislation.png';

</script>

<HowWeWorkPanel>
    <img 
        slot="process_image"
        src={Lobbying} 
        alt="lobbying" 
    />
    <p
        slot="process_paragraphs"
    >
        Advance legislation that aligns with the public arts commission mission
    </p>
</HowWeWorkPanel>

<style>

</style>