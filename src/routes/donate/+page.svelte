<script lang="ts">
    import DonateAmountButton from "$lib/components/buttons/DonateAmountButton.svelte";

    interface contributionAmount {
        id: number;
        amount: number;
    }

    const contributionAmounts: contributionAmount[] = [
        {
            id: 1,
            amount: 5
        },
        {
            id: 2,
            amount: 10
        },
        {
            id: 3,
            amount: 25
        },
        {
            id: 1,
            amount: 50
        },
        {
            id: 1,
            amount: 100
        },
        {
            id: 1,
            amount: 250
        },
    ];

</script>

<section>
    <div class="donate_section">
        <h1>
            help amplify the voice of the art community in politics to strengthen democracy by donating to public arts commission
        </h1>
        <h2>
            select an amount
        </h2>
        <h3>
            your contribution will benefit public arts commission and help us expand the political imagination
        </h3>
        <div class="donation_amounts">
            {#each contributionAmounts as contributionAmount, i}
                <DonateAmountButton>
                    {contributionAmount.amount}
                </DonateAmountButton>
            {/each}
        </div>
        
        <h3>
            would you like to make your contribution monthly?
        </h3>
    </div>
    
</section>

<style>
    .donate_section{
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
    }

    .donation_amounts {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }
</style>