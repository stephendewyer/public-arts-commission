<script lang="ts">

</script>

<span class="loader"></span>

<style>
    .loader {
        width: 3rem;
        height: 3rem;
        display: inline-block;
        position: relative;
    }
    .loader::after,
    .loader::before {
        content: '';  
        box-sizing: border-box;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        border: 4px solid #303533;
        position: absolute;
        left: 0;
        top: 0;
        animation: animloader 2s linear infinite;
    }
    .loader::after {
        animation-delay: 1s;
    }

    @keyframes animloader {
        0% {
            transform: scale(0);
            opacity: 1;
        }

        50% {
            transform: scale(0.75);
            opacity: 0.75;
        }

        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
</style>