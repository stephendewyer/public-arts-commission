<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<div 
    class="panel"
    in:fade={{ delay: 250, duration: 300 }} 
>
    <div class="process_image">
        <slot name="process_image" />
    </div>
    <div class="process_paragraphs">
        <slot name="process_paragraphs" />
    </div>
    
</div>

<style>
    .panel {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .process_image {
        width: 100%;
        max-width: 40rem;
        padding: 0.5rem 1rem;
    }

    .process_paragraphs {
        font-size: 1.75rem;
        padding: 1rem;
    }

    @media (max-width: 1140px) {

        .process_image {
            padding: 0.5rem 1rem;
        }

        .process_paragraphs {
            font-size: 1.3rem;
            padding: 0.5rem 1rem;
        }
        
    }

    @media (max-width: 720px) {

        .process_image {
            padding: 0.5rem 1rem;
        }

        .process_paragraphs {
            font-size: 1rem;
            padding: 0.5rem 1rem;
        }
        
    }
</style>