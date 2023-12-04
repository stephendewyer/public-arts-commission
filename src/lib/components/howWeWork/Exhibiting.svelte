<script lang="ts">
    import HowWeWorkPanel from '$lib/components/howWeWork/HowWeWorkPanel.svelte';
    import Exhibition from '$lib/images/process/exhibition_proposal_the_lobby.jpg';

</script>

<HowWeWorkPanel>
    <img 
        src={Exhibition} 
        alt="the lobby exhibition prototype" 
        slot="process_image"
    />
    <p
        slot="process_paragraphs"
    >
        Organize exhibitions about public arts commission&#39;s work    
    </p>
</HowWeWorkPanel>

<style>

</style>