<script lang="ts">
    import InputErrorMessage from "../errorMessages/InputErrorMessage.svelte";
    export let placeholder: string = "";
    export let inputID: string = "";
    export let inputName: string = "";
    export let inputLabel: boolean = false;
    export let numberInputValue: number | string = "";
    export let isValid: boolean = true;
    export let required: boolean = false;
    export let numberInputErrorMessage: string = "";

    let numberInputTouched: boolean = false;
    let errorMessage: string = "";

    const numberInputValueChangedHandler = () => {
        if (required) {
            if (numberInputValue === "") {
                isValid = false;
                errorMessage = numberInputErrorMessage;
            } else if (numberInputValue !== "") {
                isValid = true;
            }
        }
    }

    const numberInputFocusChangedHandler = () => {
        if (required) {
            if (numberInputTouched) {
                if (numberInputValue === "") {
                    isValid = false;
                    errorMessage = numberInputErrorMessage;
                } else if (numberInputValue !== "") {
                    isValid = true;
                }
            }
        }
    }

    const numberInputBlurChangedHandler = () => {
        if (required) {
            numberInputTouched = true;
            if (numberInputValue === "") {
                isValid = false;
                errorMessage = numberInputErrorMessage;
            } else if (numberInputValue !== "") {
                isValid = true;
            }
        }
    }

    $: if (!isValid) {
        if (numberInputValue === "") {
            errorMessage = numberInputErrorMessage;
        }
    }
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
        class={isValid ? "input" : "invalid_input"}
        placeholder={placeholder}
        id={inputID}
        name={inputName}
        type="number"
        bind:value={numberInputValue}
        on:input={numberInputValueChangedHandler}
        on:focus={numberInputFocusChangedHandler}
        on:blur={numberInputBlurChangedHandler}
    />
    {#if (!isValid)}
        <InputErrorMessage>{errorMessage}</InputErrorMessage>
    {/if}
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

    .invalid_input {
        background-color: #EFF9F2;
        border-radius: 3rem;
        color: #484B47;
        font-size: 1.4rem;
        padding: 0.5rem 1rem;
        border-width: 2px;
        border-color: #9F1D20;
        border-style: solid;
        transition: border-color 0.2s linear;
        outline: none;
        width: 100%;
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

        .invalid_input {
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

        .invalid_input {
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