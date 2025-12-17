<script lang="ts">
    export let inputID: string;
    export let inputName: string;
    export let inputLabel: boolean;
    export let selectInputValue: string | number;
    export let options: any;
    export let selectInputValueChange: any;
</script>

<div class="input_and_label_container">
    {#if inputLabel !== false}
        <div class="input_label">
            <label for={inputID} ><slot /></label>
        </div>
    {/if}
    <select
        class="input"
        id={inputID}
        name={inputName}
        bind:value={selectInputValue}
        on:change={selectInputValueChange}
        on:keyup={selectInputValueChange}
    >
        {#each options as option, i}
            <option value={option.name}>{option.name}</option>
        {/each}
    </select>
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
    
    .input {
        background-color: #EFF9F2;
        border-radius: 1rem;
        color: #484B47;
        font-size: 1.4rem;
        padding: 0.5rem 1rem;
        border-width: 2px;
        border-color: #EFF9F2;
        border-style: solid;
        will-change: border-color;
        transition: border-color 0.2s linear;
        outline: none;
        width: 100%;
        cursor: pointer;
    }

    .input:hover {
        border-color: #CB6D44;
        transition: border-color 0.2s linear;
    }

    .input:focus {
        border-color: #1C2226;
        transition: border-color 0.2s linear;
    }

    ::placeholder {
        color: #484B47;
        opacity: 50%; /* Firefox */
    }

    @media (max-width: 1440px) {
        .input {
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
        .input {
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