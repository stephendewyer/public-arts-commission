<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import productsBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan_02.jpg';

    const poleParagraphs = () => {
        return (`
            <ul >
                <li>
                    connect with campaigns, movements and events that matter to democratic supporters
                </li>
                <li>
                    use artificial intelligence to make democratic organizing easier
                </li>
                <li>
                    reduce the financial barriers to running and winning public office
                </li>
                <li>
                    meet and share ideas with other democratic supporters
                </li>
            </ul>
        `)
    }

    const democracyTrackerParagraphs = () => {
        return (`
            <ul>
                <li>
                    search elected officials by issue
                </li>
                <li>
                    see a ranking of elected officials by issue
                </li>
                <li>
                    search for how elected officials vote on an issue
                </li>
                <li>
                    use artificial intelligence to determine which elected officials are most likely to support an issue
                </li>
            </ul>
        `)
    }

        interface product {
            id: number;
            name: string;
            image: string;
            altImageText: string;
            heading: string;
            paragraphs: string;
            url: string | null;
        }

        const products: product[] = [
            {
                id: 1,
                name: "pole",
                image: "/assets/images/products/pole_logo.svg",
                altImageText: "pole logo",
                heading: "a web app to:",
                paragraphs: poleParagraphs(),
                url: null
            },
            {
                id: 2,
                name: "democracy tracker",
                image: "/assets/images/products/democracy_tracker_logo.svg",
                altImageText: "democracy tracker logo",
                heading: "a web program to:",
                paragraphs: democracyTrackerParagraphs(),
                url: null
            }
        ]


</script>
<svelte:head>
	<title>products - public arts commission</title>
	<meta name="description" content="products developed or under development by public arts commission" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<section>
    <div 
		class="login_container"
		style="background-image: url({productsBackground});"
	>
		<div class="products_section">
            <h1 class="products_heading">products</h1>
            <div class="products_container">
                {#each products as product, i}
                    <div class="product_card">
                        <div class="product_image">
                            <img src={product.image} alt={product.altImageText}/>
                        </div>
                        
                        <h2 class="product_heading">
                            {product.heading}
                        </h2>
                        <div class="paragraphs">
                            {@html product.paragraphs}
                        </div>
                        <h3 class="forthcoming">
                            forthcoming
                        </h3>
                    </div>
                {/each}
            </div>
		</div>
	</div>
</section>

<style>
    
    .login_container {
		width: 100%;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
		background-repeat: no-repeat;
		background-position: center;
	}

	.products_section {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
        padding: 1rem;
        gap: 1rem;
	}

    .products_heading {
        background-color: rgba(239,249,242,0.7);
        padding: 0.5rem 2rem 0.75rem 2rem;
    }

    .products_container {
        display: flex;
        width: 100%;
        max-width: 1420px;
        justify-content: space-evenly;
        gap: 1rem;
    }

    .product_card {
        background-color: rgba(239,249,242,0.7);
        width: 100%;
        max-width: 32rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }

    .product_image {
        padding: 1rem;
        max-width: 16rem;
        height: 16rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .product_heading {
        margin: 0;
    }

    .paragraphs {
        font-size: 1.5rem;
        padding: 0 1rem 0 1rem;
    }

    .forthcoming {
        margin: 0;
        padding: 0 0 2rem 0;

    }

    @media (max-width: 1140px) {
        .products_container {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 1420px;
            justify-content: flex-start;
            align-items: center;
            gap: 1rem;
        }
	}

	@media (max-width: 720px) {
        .product_image {
            padding: 1rem;
            max-width: 12rem;
            height: 12rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .product_heading {
            margin: 0;
        }

        .paragraphs {
            font-size: 1rem;
            padding: 0 1rem;
        }

	}

</style>