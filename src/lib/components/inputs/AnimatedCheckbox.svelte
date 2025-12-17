<script lang="ts">
  export let checked: boolean = false;
  import { v4 as uuidv4 } from 'uuid';

  let checkboxId = uuidv4();

</script>

<div class="checkbox_container">

    <input 
      type="checkbox" 
      name="checkbox" 
      id={checkboxId}
      bind:checked={checked}
    />
    <label for={checkboxId} class="terms-label">
        <svg
          class="checkbox-svg"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        <mask id="path-1-inside-1_476_5-37" fill="white">
            <rect width="200" height="200" />
        </mask>
        <rect
            width="200"
            height="200"
            class="checkbox-box"
            stroke-width="40"
            mask="url(#path-1-inside-1_476_5-37)"
        />
        <path
            class="checkbox-tick"
            d="M52 111.018L76.9867 136L149 64"
            stroke-width="15"
        />
        </svg>
    </label>
    <span class="label-text">
      <slot />
    </span>
</div>

<style>

  .checkbox_container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .checkbox_container input[type="checkbox"] {
    display: none;
  }

  .checkbox_container .terms-label {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .checkbox_container .checkbox-svg {
    width: 2.5rem;
    height: 2.5rem;
  }

  .checkbox_container .checkbox-box {
    fill: #EFF9F2;
    stroke: #CB6D44;
    stroke-dasharray: 800;
    stroke-dashoffset: 800;
    transition: stroke-dashoffset 0.6s ease-in, stroke 0.6s ease-in;
  }

  .checkbox_container .checkbox-tick {
    stroke: #CB6D44;
    stroke-dasharray: 172;
    stroke-dashoffset: 172;
    transition: stroke-dashoffset 0.6s ease-in, stroke 0.6s ease-in;
  }

  .checkbox_container input[type="checkbox"]:checked + .terms-label .checkbox-box,
  .checkbox_container input[type="checkbox"]:checked + .terms-label .checkbox-tick {
    stroke-dashoffset: 0;
    stroke: #1C2226;
    transition: stroke-dashoffset 0.6s ease-in, stroke 0.6s ease-in;
  }

  .checkbox_container input[type="checkbox"]:hover + .terms-label .checkbox-box {
    stroke-dashoffset: 0;
  }

  @media (max-width: 1440px) {

    .checkbox_container {
      font-size: 1.25rem;
    }
  
  }

  @media (max-width: 720px) {
    .checkbox_container {
      font-size: 1rem;
    }
  }

</style>