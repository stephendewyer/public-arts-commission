<script lang="ts">
    export let paymentOccurenceData;
    export let activatedOccurenceIndex: number | null = null;
    export let activatedOccurence: string = "";

    const occurenceClickedHandler = () => {
        if (paymentOccurenceData.id === activatedOccurenceIndex) {
            activatedOccurence = "";
            activatedOccurenceIndex = null;
        } else if (paymentOccurenceData.id !== activatedOccurenceIndex) {
            activatedOccurence = paymentOccurenceData.name;
            activatedOccurenceIndex = paymentOccurenceData.id;
        };
    };

</script>

<button 
    class={(paymentOccurenceData.id === activatedOccurenceIndex) ? "payment_occurence_card_selected" : "payment_occurence_card"}
    type="button"
    on:click={() => occurenceClickedHandler()}
    on:keyup={() => occurenceClickedHandler()}
>
    <div class="payment_occurence_image">
        {@html paymentOccurenceData.image}
    </div>
    <h4 class="payment_occurence_heading">
        {paymentOccurenceData.heading}
    </h4>
</button>

<style>

    .payment_occurence_card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: none;
        padding: 0.5rem 1rem;
        width: 100%;
        max-width: 14rem;
        fill: #4C4239;
        cursor: pointer;
        border: 2px solid #4C4239;
        will-change: background-color, box-shadow;
        transition: background-color 0.2s linear, border 0.2s linear, box-shadow 0.2s ease-out;
        border-radius: 1rem;
        box-shadow: none;
    }

    .payment_occurence_card:hover {
        background-color: #E3CDB2;
    }

    .payment_occurence_card_selected {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #D8EAC5;
        padding: 0.5rem 1rem;
        width: 100%;
        max-width: 14rem;
        fill: #4C4239;
        cursor: pointer;
        border: 2px solid #4C4239;
        border-radius: 1rem;
        box-shadow:
            0 1px 1px hsl(0deg 0% 0% / 0.075),
            0 2px 2px hsl(0deg 0% 0% / 0.075),
            0 4px 4px hsl(0deg 0% 0% / 0.075),
            0 8px 8px hsl(0deg 0% 0% / 0.075),
            0 16px 16px hsl(0deg 0% 0% / 0.075)
        ;
        will-change: background-color, box-shadow;
        transition: background-color 0.2s linear, border 0.2s linear, box-shadow 0.2s ease-out;
    }

    .payment_occurence_image {
        width: 6rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .payment_occurence_heading {
        margin: 0;
        padding: 1rem 0 0 0;
        text-align: left;
    }

    @media (max-width: 1440px) {

        .payment_occurence_card {
            border-radius: 1rem;
        }

        .payment_occurence_card_selected {
            border-radius: 1rem;
        }

        .payment_occurence_image {
            width: 5rem;
        }
    }

    @media (max-width: 720px) {

        .payment_occurence_card {
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 0.5rem;
        }

        .payment_occurence_card_selected {
            flex-direction: column;
            width: 100%;
            padding: 0.5rem;
        }

        .payment_occurence_image {
            width: 4rem;
        }

        .payment_occurence_heading {
            margin: 0;
            padding: 0.5rem 0 0 0;
            text-align: center;
            font-size: 0.75rem;
        }
    }
</style>