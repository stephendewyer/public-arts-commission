<script lang="ts">
    import ImageFileInput from "$lib/components/inputs/ImageFileInput.svelte";
    import TextInput from "$lib/components/inputs/TextInput.svelte";

    let imageFileInputValue: string = "";
    let imageFileIsValid: boolean = true;
    let image: any;
    $: image;

    const submitCandidateEndoresementHandler = () => {

    };

</script>
<div class="add_candidate_endorsement_container">
    <h1>add candidate endorsement</h1>
    <form 
        class="form_container"
        on:submit|preventDefault={submitCandidateEndoresementHandler}
    >
        <h2>campaign images</h2>
        <h3>select an image to represent the campaign*</h3>
        <p class="constraints">* file formats accepted: JPG, PNG, GIF</p>
        <p class="constraints">* maximum file size: 5MB</p>
        <ImageFileInput
            inputLabel={true}
            bind:imageFileInputValue={imageFileInputValue}
            bind:image={image}
            placeholder="/image.jpg"
            inputName="campaign_name_or_action"
            inputID="campaign_name_or_action"
            bind:isValid={imageFileIsValid}
            required={true}
            imageFileInputErrorMessage="image file required"
        >
            image file
        </ImageFileInput>
        {#if (image)}
            <div class="campaign_image_container">
                <img src={image} alt="test"/>
            </div>
        {/if}
        
    </form>
</div>

<style>
    .add_candidate_endorsement_container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .form_container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .constraints {
        width: 100%;
        font-weight: 600;
    }

    .campaign_image_container {
        padding: 1rem;
        max-width: 20rem;
        width: 100%;
    }
</style>

