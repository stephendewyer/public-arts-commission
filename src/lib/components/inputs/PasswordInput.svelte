<script lang="ts">
    export let placeholder: string;
    export let inputID: string;
    export let inputName: string;
    export let inputLabel: boolean;
    export let passwordInputValue: string;
    export let passwordInputValueChanged: any;
    export let passwordInputFocusChanged: any;
    export let passwordInputBlurChanged: any;
    export let isValid: boolean;
  
  </script>
  {#if inputLabel !== false}
      <div class="input_label">
          <label for={inputID} >
              <slot />
          </label>
      </div>
  {/if}
  <input 
      style={isValid ? "border-color: #EFF9F2" : "border-color: #9F1D20"}
      placeholder={placeholder}
      id={inputID}
      name={inputName}
      type="password"
      autocomplete="off"
      bind:value={passwordInputValue}
      on:input={passwordInputValueChanged}
      on:focus={passwordInputFocusChanged}
      on:blur={passwordInputBlurChanged}
  />
  
  <style>
  
      label {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1C2226;
      }
  
      .input_label {
          padding: 0 0 0.5rem 0;
      }
      
      input {
          background-color: #EFF9F2;
          border-radius: 3rem;
          color: #484B47;
          font-size: 1.4rem;
          padding: 0.5rem 1rem;
          border-width: 2px;
          border-color: #EFF9F2;
          border-style: solid;
          transition: border-color 0.2s linear;
          outline: none;
          width: 100%;
      }
  
      input:hover {
          border-color: #CB6D44;
          transition: border-color 0.2s linear;
      }
  
      input:focus {
          border-color: #1C2226;
          transition: border-color 0.2s linear;
      }
  
      ::placeholder {
          color: #484B47;
          opacity: 50%; /* Firefox */
      }
  
      @media (max-width: 1440px) {
          input {
              font-size: 1.2rem;
          }
  
          label {
              font-size: 1.2rem;
          }
  
          .input_label {
              padding: 0 0 0.4rem 0;
          }
      }
  
      @media (max-width: 720px) {
          input {
              font-size: 1rem;
          }
  
          label {
              font-size: 1rem;
          }
  
          .input_label {
              padding: 0 0 0.3rem 0;
          }
      }
  
  </style>