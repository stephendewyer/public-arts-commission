<script lang="ts">
    import MonthlyDonationIcon from "$lib/images/icons/recurring_payment_month.svg?raw";
    import YearlyDonationIcon from '$lib/images/icons/recurring_payment_year.svg?raw';
    import SingleDonationIcon from '$lib/images/icons/single_payment_icon.svg?raw';

    interface PaymentOccurence {
        id: number;
        image: string;
        heading: string;
    }

    const paymentOccurenceOptions: PaymentOccurence[] = [
        {
            id: 1,
            image: MonthlyDonationIcon,
            heading: "monthly contribution"
        },
        {
            id: 2,
            image: YearlyDonationIcon,
            heading: "yearly contribution"
        },
        {
            id: 3,
            image: SingleDonationIcon,
            heading: "one-time donation"
        }
    ]

    let activatedOccurenceIndex: number = 1;

    const paymentOccurenceClickHandler = (index: number, paymentIndex: number) => {

        if ((index + 1) === paymentIndex) {

            activatedOccurenceIndex = paymentIndex;
        };
    }

</script>

<div class="payment_occurence_options">
    {#each paymentOccurenceOptions as paymentOccurence, index}
        <div
            on:click={() => paymentOccurenceClickHandler(index, paymentOccurence.id)}
            on:keyup={() => paymentOccurenceClickHandler(index, paymentOccurence.id)}
            role="checkbox"
            tabindex={-index}
            aria-checked={(index + 1) === activatedOccurenceIndex ? true : false}
            class={ (index + 1) === activatedOccurenceIndex ? "occurence_payment_card_selected" : "occurence_payment_card" } 
        >
            <div class="payment_occurence_image">
                {@html paymentOccurence.image}
            </div>
            <h4 class="payment_occurence_heading">
                {paymentOccurence.heading}
            </h4>
        </div>
    {/each}
</div>

<style>
    .payment_occurence_options {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-around;
        gap: 1rem;
        margin: 0 0 2rem 0;
    }

    .occurence_payment_card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 14rem;
        padding: 2rem;
        background-color: none;
        fill: #4C4239;
        cursor: pointer;
        will-change: background-color;
        transition: background-color 0.2s linear;
        border-radius: 1rem;
    }

    .occurence_payment_card:hover {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .occurence_payment_card_selected {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 14rem;
        padding: 2rem;
        background-color: #4C4239;
        fill: #D8EAC5;
        cursor: pointer;
        will-change: background-color, fill;
        transition: background-color 0.2s linear, fill 0.2s linear;
        border-radius: 1rem;
    }

    .occurence_payment_card_selected > .payment_occurence_heading {
        color: #D8EAC5;
        will-change: color;
        transition: color 0.2s linear;
    }

    .occurence_payment_card > .payment_occurence_heading {
        color: #4C4239;
        will-change: color;
        transition: color 0.2s linear;
    }

    .payment_occurence_image {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .payment_occurence_heading {
        margin: 0;
        padding: 1rem 0 0 0;
        text-align: center;
    }

    @media (max-width: 1440px) {

        .payment_occurence_options {
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-around;
            gap: 0.75rem;
            margin: 0 0 1.5rem 0;
        }
        .occurence_payment_card {
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 1.5rem;
            border-radius: 1rem;
        }

        .occurence_payment_card_selected {
            flex-direction: column;
            width: 100%;
            padding: 1.5rem;
            border-radius: 1rem;
        }
    }

    @media (max-width: 720px) {

        .payment_occurence_options {
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-around;
            gap: 0.75rem;
            margin: 0 0 1rem 0;
        }

        .occurence_payment_card {
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 0.5rem;
            border-radius: 0.5rem;
        }

        .occurence_payment_card_selected {
            flex-direction: column;
            width: 100%;
            padding: 0.5rem;
            border-radius: 1rem;
        }

        .payment_occurence_image {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .payment_occurence_heading {
            margin: 0;
            padding: 0.5rem 0 0 0;
            text-align: center;
            font-size: 0.75rem;
        }
    }

</style>