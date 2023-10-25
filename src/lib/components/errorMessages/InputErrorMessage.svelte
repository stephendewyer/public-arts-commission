<script lang="ts">

</script>

<div class="error_message">
    <slot />
</div>

<style>
    .error_message {
        color: #9F1D20;
        font-size: 1.5rem;
        padding: 0.25rem 1rem;
    }

    @media (max-width: 1440px) {
        .error_message {
            font-size: 1.25rem;
            padding: 0.25rem 1rem;
        }
    }

    @media (max-width: 1440px) {
        .error_message {
            font-size: 1rem;
            padding: 0.25rem 1rem;
        }
    }
</style>