<script lang="ts">
    import InputErrorMessage from '$lib/components/errorMessages/InputErrorMessage.svelte';
    import { ImageFileExtensionTest } from "$lib/utils/ImageFileExtensionTest";
    import CancelSubmitButton from '$lib/components/buttons/CancelSubmitButton.svelte';
    export let placeholder: string;
    export let inputID: string;
    export let inputName: string;
    export let inputLabel: boolean;
    export let files: FileList | null = null;
    export let imageFileInputValue: string = ""; 
    export let image: string | ArrayBuffer | null | undefined | any;
    export let isValid: boolean;
    export let imageFileInputErrorMessage: string = "";
    export let required: boolean;
    export let deleteImage: boolean = false;

    export let imageFileInputElement: HTMLInputElement;

    let imageFile: File | null = null;

    const imageFileChangedHandler = () => {

        image = "";
        if (required) {
            if (imageFileInputValue === "") {
                isValid = false;
                imageFileInputErrorMessage = "image required!";
            };
        };

        if (files !== null) {
            imageFile = files[0];
            if (imageFile.size > 2000000) {
                isValid = false;
                imageFileInputErrorMessage = "images cannot exceed 2MB in size!";
            } else if (!ImageFileExtensionTest(files[0].type)) {
                isValid = false;
                imageFileInputErrorMessage = "invalid file type";
            } else {
                const fileReader = new FileReader();
                isValid = true;
                imageFileInputErrorMessage = "";
                fileReader.onload = (e) => {
                    // the file's text will be printed here;
                    image = e.target?.result;
                };
                fileReader.readAsDataURL(files[0]);
            };
        };
    };

    let cancelImageUpload: boolean = false;

    $: if (cancelImageUpload) {
        imageFileInputElement.value = "";
        imageFileInputValue = "";
        deleteImage = true;
        image = null;
        cancelImageUpload = false;
    } else {
        deleteImage = false;
    };

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
        type="file"
        bind:this={imageFileInputElement}
        bind:value={imageFileInputValue}
        bind:files={files}
        on:change={imageFileChangedHandler}
        style={image ? "display: none" : ""}
    />
    {#if (!isValid)}
        <InputErrorMessage>
            {imageFileInputErrorMessage}
        </InputErrorMessage>
    {/if}
    {#if (image)}
        <div class="project_image_container">
            <img src={image} alt="project"/>
            <div class="cancel_button_container">
                <CancelSubmitButton bind:closeButtonClicked={cancelImageUpload} />
            </div>
        </div>
    {/if}
    <p class="constraints">* file formats accepted: <span style="font-weight: bold">JPG, PNG, GIF, jpg, png, gif</span></p>
    <p class="constraints">* maximum file size: <span style="font-weight: bold">2MB</span></p>
</div>
 
<style>
    input[type="file"]::file-selector-button {
        display: none;
    }

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
        background-image: url('$lib/images/icons/folder_icon.svg');
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

    .project_image_container {
        position: relative;
        padding: 1rem;
    }

    .cancel_button_container {
        position: absolute;
        right: 1rem;
        top: 1rem;
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

    @media screen and (max-width: 1080px) {
        .cancel_button_container {
            right: 0.5rem;
            top: 0.5rem;
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

        .cancel_button_container {
            right: 0.25rem;
            top: 0.25rem;
        }
    }

</style>