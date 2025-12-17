<script lang="ts">
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import '@splidejs/svelte-splide/css';
  import { afterUpdate } from 'svelte';

  interface image {
    index: number;
    src: string;
    alt: string
  }

  let images: image[] = [
    {
      index: 0,
      src: "assets/images/sliders/slideshow_01/Erin_Maye_Quade_and_stephen_dewyer_13_August_2018.jpg",
      alt: "public arts commission Founder stephen dewyer handshakes with Erin Maye Quade in front of public art in Northfield, Minnesota on 13 August 2018"
    }, 
    {
      index: 1,
      src: "assets/images/sliders/slideshow_01/Katie_for_Ward_10_endorsed.jpg",
      alt: "Katie Jones for Ward 10 endorsed by public arts commission"
    }
  ]

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
        {#each images as image, i}
          <SplideSlide >
            <img 
              class="main_image" 
              src={image.src} 
              alt={image.alt} 
            />
          </SplideSlide>
        {/each}
      </Splide>
    </div>
    <div class="gallery_thumbs">
      <Splide
        id="gallery--thumbs"
        bind:this={ thumbs } 
        options={ thumbsOptions }
        aria-label="impact splide thumbnails"
      >
        {#each images as thumbnailImage, i}
          <SplideSlide >
            <img 
              class="thumbnail_image"
              src={thumbnailImage.src} 
              alt={thumbnailImage.alt} 
            />
          </SplideSlide>
        {/each}
      </Splide>
    </div>
  </div>
</div>

<style>

  .gallery_main {
    padding: 0 0 1rem 0;
  }

  .main_image {
    height: 100%;
    max-height: 40rem;
    object-fit: cover;
    width: 100%;
  }

  .thumbnail_image {
    height: 100%;
    max-height: 10rem;
    object-fit: cover;
    width: 100%;
  }

  @media (max-width: 1440px) {

    .main_image {
      max-height: 40rem;
    }

  }

  @media (max-width: 720px) {

    .main_image {
      max-height: 14rem;
    }

    .thumbnail_image {
      max-height: 4rem;
    }

  }

</style>