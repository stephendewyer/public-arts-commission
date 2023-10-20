<script lang="ts">

    export let open = false;


</script>

<aside 
    class="{ (open) ? 'side_drawer_open' : 'side_drawer_closed' }"
    aria-hidden="{ (open) ? 'false' : 'true'}"
>

    
</aside>

<style>
    aside {
        z-index: 50;
    }

    .side_drawer_closed {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: #3F5A72;
        left: 2rem;
        right: 0;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    }

    .side_drawer_open {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: #3F5A72;
        top: 0;
        right: 0;
        left: 2rem;
        width: auto;
        transform: translateX(0);
        transition: transform 0.3s ease-in-out;
    }
    
    @media (min-width: 1140px) {

      .side_drawer_closed {
          display: none;
      }

      .side_drawer_open {
          display: none;
      }

    }

</style>