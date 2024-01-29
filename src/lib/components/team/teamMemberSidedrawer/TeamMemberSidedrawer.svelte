<script lang="ts">
    import { TeamMemberSelectedStore } from '$lib/stores/TeamMemberSelectedStore';
    import { TeamMemberSidedrawerOpenStore } from '$lib/stores/TeamMemberSidedrawerOpenStore';
    import TeamMemberData from '$lib/data/teamMembers.json';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';
    import { page } from '$app/stores';

    let URLPathName: string = $page.url.pathname;

    const data: TeamMember[] = TeamMemberData;

    let memberCardSelectId: number | null = null;

    $: memberCardSelectId = $TeamMemberSelectedStore;

    let teamMemberSidedrawerOpen: boolean = false;

    $: teamMemberSidedrawerOpen = $TeamMemberSidedrawerOpenStore;

    const closeClickHandler = () => {

        $TeamMemberSidedrawerOpenStore = false;
        $TeamMemberSelectedStore = null;

    };

</script>

<aside 
    class={ (teamMemberSidedrawerOpen) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ (teamMemberSidedrawerOpen) ? 'false' : 'true'}
>
    <div class="close_button_container">
        <a href={URLPathName}>
            <button 
                class="close_button"
                on:click={() => closeClickHandler()}
                on:keyup={() => closeClickHandler()}
            >
                {@html CloseIcon}
            </button>
        </a>
    </div>
    {#each data as teamMember, i}
        {#if teamMember.index === memberCardSelectId}
            <div>
                <picture>
                    <img src={teamMember.imageSource} alt={teamMember.imageAltText} />
                </picture>
                <div class="info_container">
                    <h2>
                        {teamMember.name}
                    </h2>
                    <h3>
                        {teamMember.title}
                    </h3>
                    <p>
                        {@html teamMember.bio}
                    </p>
                    {#if (teamMember.email !== null)}
                        <h4 class="info_heading">
                            email
                        </h4>
                        <a href={`mailto:${teamMember.email}`}>
                            {teamMember.email}
                        </a>
                    {/if}
                    {#if (teamMember.urlAddress !== null)}
                        <h4 class="info_heading">
                            website(s)
                        </h4>
                        <ul>
                            {#each teamMember.urlAddress as url, i}
                                <a href={url} target="_blank">
                                    <li class="urlAddress">
                                        {url}
                                    </li>
                                </a>
                            {/each}
                        </ul>
                    {/if}
                </div>
                
            </div>
        {/if}
    {/each}
</aside>

<style>

    aside {
        z-index: 52;
    }

    .side_drawer_closed {
        position: fixed;
        height: 100vh;
        overflow-y: scroll;
        width: 100%;
        max-width: 40rem;
        background-color: #F4F5FB;
        top: 0;
        left: auto;
        right: 0;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    }

    .side_drawer_open {
        position: fixed;
        height: 100vh;
        overflow-y: scroll;
        width: 100%;
        max-width: 40rem;
        background-color: #F4F5FB;
        top: 0;
        right: 0;
        left: auto;
        transform: translateX(0);
        transition: transform 0.3s ease-in-out;
    }

    .close_button_container {
        position: sticky;
        position: -webkit-sticky;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        display: flex;
        background-color: #F4F5FB;
        justify-content: flex-end;
        border-bottom: #1C2226 2px solid;
    }

    .close_button {
        outline: none;
        border: none;
        background-color: transparent;
        fill: #4C4239;
        transition: fill 0.2s linear;
        width: 3rem;
        margin: 1rem;
        cursor: pointer;
        
    }

    .close_button:hover {
        fill: #CB6D44;
    }

    .info_container {
        padding: 1rem 2rem;
    }

    .info_heading {
        text-decoration: underline;
        font-size: 1.5rem;
    }

    .urlAddress {
        overflow-wrap: break-word;
    }
    
    @media (max-width: 1140px) {

        .close_button {
            width: 2rem;
            margin: 1rem;
        }
        
        .side_drawer_closed {
            left: auto;
        }

        .side_drawer_open {
            left: auto;
        }

        .info_heading {
            font-size: 1.3rem;
        }

    }

    @media (max-width: 720px) {

        .info_heading {
            font-size: 1rem;
        }

    }

</style>