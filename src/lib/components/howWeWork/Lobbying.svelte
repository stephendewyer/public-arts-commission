<script lang="ts">
    import HowWeWorkPanel from '$lib/components/howWeWork/HowWeWorkPanel.svelte';
    import Lobbying from '$lib/images/process/legislation.png';

</script>

<HowWeWorkPanel>
    <div
        slot="process_image"
        class="lobbying_image"
    >
        <img 
            src={Lobbying} 
            alt="lobbying" 
        />
    </div>
    
    <p
        slot="process_paragraphs"
    >
        Advance legislation that aligns with the public arts commission mission
    </p>
</HowWeWorkPanel>

<style>

    .lobbying_image {
        max-width: 18rem;
        margin: 0 auto;
    }
    
</style>