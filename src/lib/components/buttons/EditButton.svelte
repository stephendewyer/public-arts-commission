<script lang="ts">
  import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
</script>

<button class="edit_button_container">
    <slot />
    <div class="edit_icon_container">
        {@html EditIcon}
    </div>
</button>

<style>

.edit_button_container {
    margin: 0;
		color: #4C4239;
		fill: #4C4239;
    background-color: transparent;
		border: none;
		padding: 0.5rem 1rem;
		gap: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
		transition: color 0.2s linear, fill 0.2s linear;
    overflow-wrap: normal;
    hyphens: none;
    white-space: none;
	}

	.edit_button_container:hover {
		color: #28387C;
    fill: #28387C;
	}

	.edit_icon_container {
		width: 1.5rem;
	}

  @media (max-width: 1140px) {

    .edit_button_container {
        font-size: 0.9rem;
    }

    .edit_icon_container {
      width: 1.25rem;
    }
      
	}

	@media (max-width: 720px) {
    .edit_button_container {
        font-size: 0.8rem;
    }

	}
    
</style>