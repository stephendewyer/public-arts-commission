<script lang="ts">
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import '@splidejs/svelte-splide/css';
  import SliderImage01 from '$lib/images/slides/slideshow_01/Erin_Maye_Quade_and_stephen_dewyer_13_August_2018.jpg';
  import SliderImage03 from '$lib/images/slides/slideshow_01/Katie_for_Ward_10_endorsed.jpg';
  import { afterUpdate } from 'svelte';

  // set up carousel config
  const mainOptions = {
    pagination: true,
    type: "loop",
    gap     : '1rem',
    autoplay: true,
    arrows  : true,
  };
  const thumbsOptions = {
    arrows: false,
    gap: 5,
    isNavigation: true,
    pagination: false,
    perMove: 1,
    perPage: 4,
    type: "loop",
    updateOnMove: true,
  };

  // sync carousels
  let main: any = Splide;
  let thumbs: any = SplideSlide;

  $: if (main && thumbs) {
    afterUpdate(() => {
      // console.log({ main, thumbs });
      main.sync(thumbs.splide);
    });
  };
  

</script>
<div>
  <div class="splide" >
    <div class="gallery_main">
      <Splide 
        bind:this={ main } 
        options={ mainOptions }
        aria-label="impact splide main gallery"
      >
        <SplideSlide >
          <img src={SliderImage01} alt="public arts commission Founder stephen dewyer handshakes with Erin Maye Quade in front of public art in Northfield, Minnesota on 13 August 2018" />
        </SplideSlide>
        <SplideSlide class="splide__slide">
          <img src={SliderImage03} alt="Katie Jones for Ward 10 endorsed by public arts commission" />
        </SplideSlide>
      </Splide>
    </div>
    <div class="gallery_thumbs">
      <Splide
        id="gallery--thumbs"
        bind:this={ thumbs } 
        options={ thumbsOptions }
        aria-label="impact splide thumbnails"
      >
        <SplideSlide >
          <img src={SliderImage01} alt="public arts commission Founder stephen dewyer handshakes with Erin Maye Quade in front of public art in Northfield, Minnesota on 13 August 2018" />
        </SplideSlide>
        <SplideSlide class="splide__slide">
          <img src={SliderImage03} alt="Katie Jones for Ward 10 endorsed by public arts commission" />
        </SplideSlide>
      </Splide>
    </div>
  </div>
</div>

<style>

</style>