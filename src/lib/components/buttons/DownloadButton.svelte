<script lang="ts">
  import DownloadIcon from "$lib/images/icons/download_file_icon.svg?raw";
  import DocumentIcon from "$lib/images/icons/document.svg?raw";
  export let linkTarget: string = "";

</script>
<a 
  href={linkTarget} 
  target="_blank" 
  class="download_button_container"
>
  <button class="download_button">
    <div class="document_text_and_image">
      <div class="document_text">
        <slot />
      </div>
      <div class="document_icon">
        {@html DocumentIcon}
      </div>
    </div>
    <div class="download_icon">
      {@html DownloadIcon}
    </div>

  </button>
</a>


<style>

  .download_button_container {
    width: auto;
    display: inline-flex;
    margin: 1rem;
  }

  .download_button {
    background-color: #E3CDB2;
    color: #4C4239;
    fill: #4C4239;
    border: 3px solid #E3CDB2;
    padding: 1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s linear, border 0.2s linear;
  }

  .download_button:hover {
    background-color: #D8EAC5;
    border: 3px solid #4C4239;
  }

  .document_text_and_image {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .document_text {
    font-weight: 600;
    font-size: 1.5rem;
  }

  .document_icon {
    width: 100%;
    max-width: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .download_icon {
    width: 100%;
    max-width: 1rem;
    height: 100%;
    position: relative;
  }

  @media (max-width: 1440px) {

    .download_button_container {
      margin: 0.75rem 1rem;
    }

    .download_button {
      padding: 0.75rem;
    }

    .document_text {
      font-size: 1.25rem;
    }

    .document_icon {
      max-width: 1.5rem;
    }

    .download_icon {
      max-width: 0.75rem;
    }
  }

  @media (max-width: 720px) {

    .download_button_container {
      margin: 0.5rem 1rem;
    }

    .download_button {
      padding: 0.5rem;
      border: 1px solid #E3CDB2;
    }

    .download_button:hover {
      border: 1px solid #4C4239;
    }

    .document_text {
      font-size: 1rem;
    }

    .document_icon {
      height: 2.5rem;
    }

    .download_icon {
      max-width: 0.5rem;
    }
  }

</style>