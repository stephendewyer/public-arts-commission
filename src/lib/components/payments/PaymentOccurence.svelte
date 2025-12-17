<script lang="ts">
    import PaymentOccurenceCard from "$lib/components/cards/paymentOccurenceCards/PaymentOccurenceCard.svelte";
    import MonthlyDonationIcon from "$lib/images/icons/recurring_payment_month.svg?raw";
    import YearlyDonationIcon from '$lib/images/icons/recurring_payment_year.svg?raw';
    import SingleDonationIcon from '$lib/images/icons/single_payment_icon.svg?raw';
    import InputErrorMessage from "../errorMessages/InputErrorMessage.svelte";

    export let paymentOccurenceIsValid: boolean = true;

    export let activatedOccurenceIndex: number | null = null;

    export let activatedOccurence: string = "";

    interface PaymentOccurence {
        id: number;
        image: string;
        heading: string;
        name: string;
    };

    const paymentOccurenceOptions: PaymentOccurence[] = [
        {
            id: 1,
            image: MonthlyDonationIcon,
            heading: "monthly contribution",
            name: "monthly_contribution"
        },
        {
            id: 2,
            image: YearlyDonationIcon,
            heading: "yearly contribution",
            name: "yearly_contribution"
        },
        {
            id: 3,
            image: SingleDonationIcon,
            heading: "one-time donation",
            name: "one-time_donation"
        }
    ];

</script>

<div class="payment_occurence_options">
    {#each paymentOccurenceOptions as paymentOccurence, index}
        <PaymentOccurenceCard
            paymentOccurenceData={paymentOccurence}
            bind:activatedOccurence={activatedOccurence}
            bind:activatedOccurenceIndex={activatedOccurenceIndex}
        />
    {/each}
</div>
{#if !paymentOccurenceIsValid}
    <InputErrorMessage>
        payment occurence required
    </InputErrorMessage>
{/if}

<style>
    .payment_occurence_options {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-around;
        gap: 1rem;
        margin: 0 0 2rem 0;
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
    }

</style>