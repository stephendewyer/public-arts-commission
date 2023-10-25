<script lang="ts">
    export let placeholder: string;
    export let inputID: string;
    export let inputName: string;
    export let inputLabel: boolean;
    export let searchInputValue: string;  
    export let searchInputValueChange: any;
</script>

<div class="input_and_label_container">
    {#if inputLabel !== false}
        <div class="input_label">
            <label for={inputID} >
                <slot />
            </label>
        </div>
    {/if}
    <input 
        placeholder={placeholder}
        id={inputID}
        name={inputName}
        type="search"
        bind:value={searchInputValue}
        on:input={searchInputValueChange}
    />
</div>
  
  
<style>

    .input_and_label_container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

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
    padding: 0.5rem 1rem 0.5rem 3rem;
    border-width: 2px;
    border-color: #EFF9F2;
    border-style: solid;
    transition: border-color 0.2s linear;
    outline: none;
    width: 100%;
    background-image: url('$lib/images/icons/magnifying_glass.svg');
    background-size: 1.8rem;
    background-repeat: no-repeat;
    background-position: 10px center;          
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

    input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    cursor: pointer;
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-left: 10px;
    background:
        linear-gradient(45deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 43%,#000 45%,#000 55%,rgba(0,0,0,0) 57%,rgba(0,0,0,0) 100%),
        linear-gradient(135deg, transparent 0%,transparent 43%,#000 45%,#000 55%,transparent 57%,transparent 100%);
    }

    @media (max-width: 1440px) {

    input {
        font-size: 1.2rem;
        padding: 0.5rem 1rem 0.5rem 2.5rem;
        background-size: 1.5rem;       
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