<script lang="ts">
    import EmblaCarouselSvelte from "embla-carousel-svelte";
    import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
    import Autoplay from "embla-carousel-autoplay";
    import NextButton from "../buttons/NextButton.svelte";
    import PreviousButton from "../buttons/PreviousButton.svelte";
    import LeightonRockafellowJrProfile from "$lib/images/sliders/highlighted_campaigns/Lieghton_Rockafellow_Jr.jpg";
    import JuliaSalazarProfile from "$lib/images/sliders/highlighted_campaigns/Julia_Salazar.jpg";
    import { onDestroy } from 'svelte';
    
    interface Slide {
      index: number;
      imageSrc: string;
      alt: string;
      name: string;
      campaign: string;
      paragraph: string;
      date: string;
    };

    let testimonials: Slide[] = [
        {
            index: 1,
            imageSrc: LeightonRockafellowJrProfile,
            alt: "Leighton Rockafellow Jr. profile",
            name: "Leighton Rockafellow Jr.",
            campaign: "candidate for Tucson Ward 6",
            paragraph: `Tucson is a shining example of how public art can shape a city’s persona. If elected, I would work to promote our murals and public art as a tourist attraction. I will work to bolster the relationship between the city and existing non-profit organizations such as the Arts Foundation for Tucson and Southern Arizona. City funded projects should always include elements of public art, preferably from local artists.`,
            date: "2025"
        },
        {
            index: 2,
            imageSrc: JuliaSalazarProfile,
            alt: "Julia Salazar profile",
            name: "Julia Salazar",
            campaign: "candidate for New York State Senate District 18",
            paragraph: "Artists have always been there to chronicle political movements and moments of great upheaval.  Their work is no less important in the digital age.  It’s my honor to be supported by the Public Arts Commission and all artists who believe in aiding the fight for social justice with the power of art.",
            date: "2018"
        }
    ];

    let emblaApi: EmblaCarouselType;

    let options: EmblaOptionsType = { loop: true };

    let plugins = [Autoplay({
        stopOnInteraction: false, 
        delay: 6000
    })];

    let selectedIndex: number = 0;

    const onSelect = (emblaApi: EmblaCarouselType): void => {
        if (!emblaApi) {
            return;
        }
        selectedIndex = emblaApi.selectedScrollSnap();
    }

    let prevBtnEnabled: boolean = false;
    let nextBtnEnabled: boolean = false;

    let scrollSnaps: number[] = [];

    function onInit(event: { detail: EmblaCarouselType }) {
        emblaApi = event.detail;
        // console.log(emblaApi.slideNodes()); // Access API
        emblaApi.on("select", onSelect);
        if (emblaApi.canScrollNext()) {
            nextBtnEnabled = true;
        } else {
            nextBtnEnabled = false;
        };
        if (emblaApi.canScrollPrev()) {
            prevBtnEnabled = true;
        } else {
            prevBtnEnabled = false;
        };
        scrollSnaps = emblaApi.scrollSnapList();
    };

    onDestroy(() => {
        emblaApi?.destroy();
    });

    const onNavButtonClick = (emblaApi: EmblaCarouselType) => {
        const autoplay: any = emblaApi?.plugins()?.autoplay;
        autoplay.reset();
    };

    let scrollPreviousClicked: boolean = false;

    $: if (scrollPreviousClicked) {
        emblaApi.scrollPrev();
        onNavButtonClick(emblaApi);
        scrollPreviousClicked = false;
    };

    let scrollNextClicked: boolean = false;

    $: if (scrollNextClicked) {
        emblaApi.scrollNext();
        onNavButtonClick(emblaApi);
        scrollNextClicked = false;
    };

    const scrollTo = (index: number) => {
        emblaApi.scrollTo(index);
        const autoplay: any = emblaApi?.plugins()?.autoplay;
        autoplay.reset();
    };

</script>
<div class="slide_carousel_container">
    <div class="arrows">
        <PreviousButton
            bind:clicked={scrollPreviousClicked}
            disabled={!prevBtnEnabled}
        />
        <NextButton
            bind:clicked={scrollNextClicked}
            disabled={!nextBtnEnabled}
        />
    </div>
    <div class="slide_container">
        <div 
            use:EmblaCarouselSvelte="{{ options, plugins }}"
            on:emblaInit="{onInit}"
            class="embla"
            role="group"
        >   <div class="embla__container">
                {#each testimonials as testimonial, i}
                    <div class="embla__slide">
                        <div class="slide_inner">
                            <div class="profile">
                                <img 
                                    class="slide_image"
                                    src={testimonial.imageSrc} 
                                    alt={testimonial.alt}
                                />
                                <h4 class="name">{testimonial.name}</h4>
                                <h5 class="company">{testimonial.campaign}</h5>
                            </div>
                            <p class="paragraphs">
                                <span class="review">{testimonial.paragraph}</span>
                                <span class="date">{testimonial.date}</span>
                            </p>    
                        </div>
                    </div>
                {/each} 
            </div>
        </div>
    </div>
    <div class="embla__dots">
        {#each scrollSnaps as _, index}
            <button
              on:click={() => scrollTo(index)}
              class={`embla__dot ${(index === selectedIndex) ? "embla__dot--selected" : ""}`}
            >
            </button>
        {/each}
    </div>
</div>

<style>

    .slide_image {
        width: 100%;
    }

    .slide_carousel_container {
        max-width: 60rem;
        width: 100%;
        position: relative;
        height: relative;
        margin: 0 auto;
    }

    .slide_container {
        padding: 0 4rem;
    }

    .slide_inner {
        display: block;
    }

    .profile {
        width: 100%;
        max-width: 12rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        float: left;
        padding: 0 0.5rem 0.2rem 0;
    }

    .review {
        padding: 0;
        margin: 0;
        display: block;
    }

    .date {
        padding: 0.5rem 0 0 0;
        margin: 0;
        font-style: italic;
        display: block;
    }

    .embla {
        width: 100%;
        height: auto;
        overflow: hidden;
        margin: 0 auto 0 auto;
    }

    .arrows {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        padding: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        margin: 0 auto;
        background: transparent;
    }

    .embla__container {
        display: flex;
    }

    .embla__slide {
        flex: 0 0 100%;
        width: 100%;
        height: 100%;
        max-height: 1333px;
    }

    .embla__dots {
        position: relative;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .embla__dot {
        -webkit-tap-highlight-color: rgba(49, 49, 49, 0.5);
        -webkit-appearance: none;
        appearance: none;
        background-color: transparent;
        touch-action: manipulation;
        display: inline-flex;
        text-decoration: none;
        cursor: pointer;
        border: 0;
        padding: 0;
        margin: 0;
        width: 2.6rem;
        height: 2.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }

    .embla__dot::after {
        box-shadow: inset 0 0 0 0.2rem #838b6a;
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        content: '';
        transition: box-shadow 0.3s linear, background-color 0.3s linear;
    }

    .embla__dot:hover::after {
        box-shadow: inset 0 0 0 0.2rem #d79679;
    }

    .embla__dot--selected::after {
        box-shadow: inset 0 0 0 0.2rem #838b6a;
        background-color: #F4FEF2; 
        transition: box-shadow 0.3s linear, background-color 0.3s linear;
    }

    .embla__dot--selected:hover::after {
        box-shadow: inset 0 0 0 0.2rem #838b6a;
        background-color: #F4FEF2; 
    }

    .name {
        margin: 0;
    }

    .campaign {
        margin: 0;
    }

    @media screen and (max-width: 1080px) {
    }

    @media (max-width: 750px) {

        .profile {
            max-width: 8rem;
        }

        .slide_container {
            padding: 0 3rem;
        }

        .arrows {
            padding: 0rem;
        }

        .embla__dots {
            position: relative;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
        }

        .embla {
            margin: 0;
        }

        .embla__slide {
            width: 100%;
        }
    }

</style>