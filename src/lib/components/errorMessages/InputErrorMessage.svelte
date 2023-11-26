<script lang="ts">
    import ErrorIcon from '$lib/components/flashIcons/ErrorIcon.svelte';
</script>

<div class="error_message">
    <ErrorIcon /><slot />
</div>

<style>
    .error_message {
        display: flex;
        gap: 0.5rem;
        align-items: center;
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

    @media (max-width: 720px) {
        .error_message {
            font-size: 1rem;
            padding: 0.25rem 1rem;
        }
    }
</style>