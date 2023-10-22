<script lang="ts">
    import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css';
    import SliderImage01 from '$lib/images/slides/slideshow_01/Erin_Maye_Quade_and_stephen_dewyer_13_August_2018.jpg';
    import SliderImage02 from '$lib/images/slides/slideshow_01/Julia_Salazar_screenshot.jpg';
    import SliderImage03 from '$lib/images/slides/slideshow_01/Katie_for_Ward_10_endorsed.jpg';

    const options = {
        rewind  : true,
        gap     : '1rem',
        autoplay: true,
        arrows  : true,
    }

</script>
<Splide hasTrack={ false } aria-label="..." options={ options } >
    <SplideTrack>
      <SplideSlide class="slide">
        <img src={SliderImage01} alt="public arts commission Founder stephen dewyer handshakes with Erin Maye Quade in front of public art in Northfield, Minnesota on 13 August 2018" />
      </SplideSlide>
      <SplideSlide class="slide">
        <img src={SliderImage02} alt="Julia Salazar on receiving a public arts commission endorsement" />
      </SplideSlide>
      <SplideSlide class="slide">
        <img src={SliderImage03} alt="Katie Jones for Ward 10 endorsed by public arts commission" />
      </SplideSlide>
    </SplideTrack>
  
    <div class="splide__arrows">
      <button class="splide__arrow splide__arrow--prev">
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 329.46 500">
            <defs>
              <style>
                .cls-12 {
                  fill: inherit;
                  stroke-width: 0px;
                }
              </style>
            </defs>
            <polygon class="cls-12" points="329.46 250 103.48 500 0 500 225.98 250 0 0 103.48 0 329.46 250"/>
          </svg>
      </button>
      <button class="splide__arrow splide__arrow--next">
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 329.46 500">
            <defs>
              <style>
                .cls-12 {
                  fill: inherit;
                  stroke-width: 0px;
                }
              </style>
            </defs>
            <polygon class="cls-12" points="329.46 250 103.48 500 0 500 225.98 250 0 0 103.48 0 329.46 250"/>
          </svg>
      </button>
    </div>
</Splide>

<style>

</style>