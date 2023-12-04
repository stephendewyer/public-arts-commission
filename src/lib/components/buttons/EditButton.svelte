<script lang="ts">
  import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
</script>

<button>
    <slot />
    <div>
        {@html EditIcon}
    </div>
</button>

<style>
    
</style>