<script lang="ts">
  export let placeholder: string;
  export let inputID: string;
  export let inputName: string;
  export let inputType: string;

</script>
<label for={inputID}></label>
<input 
    placeholder={placeholder}
    id={inputID}
    name={inputName}
    type={inputType}
/>

<style>
    
    input {
        background-color: #EFF9F2;
        border-radius: 3rem;
        color: #484B47;
        font-size: 1.5rem;
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
            font-size: 1.25rem;
            
        }
    }

    @media (max-width: 720px) {
        input {
            font-size: 1rem;
        }
    }

</style>