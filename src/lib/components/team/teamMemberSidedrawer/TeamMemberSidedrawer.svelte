<script lang="ts">
    import { TeamMemberSelectedStore } from '$lib/stores/TeamMemberSelectedStore';
    import { TeamMemberSidedrawerOpenStore } from '$lib/stores/TeamMemberSidedrawerOpenStore';
    import TeamMemberData from '$lib/data/teamMembers.json';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';
    import { page } from '$app/state';
    import EmailIcon from '$lib/images/icons/email_icon.svg?raw';
    import ExternalLinkIcon from '$lib/images/icons/external_link_icon.svg?raw';

    export let pageSearch;

    $: if (!pageSearch) {
        $TeamMemberSidedrawerOpenStore = false;
        $TeamMemberSelectedStore = null;
    };
    
    let URLPathName: string = page.url.pathname;

    const teamMembers: TeamMember[] = TeamMemberData;

    let memberCardSelectId: number | null = null;

    $: memberCardSelectId = $TeamMemberSelectedStore;

    let teamMember: TeamMember | null | undefined = null;

    $: if (memberCardSelectId) {
        teamMember = teamMembers.find((teamMember) => {
            return (teamMember?.index === memberCardSelectId);
        });
    } else {
        teamMember = null;
    };

    const closeClickHandler = () => {
        $TeamMemberSidedrawerOpenStore = false;
        $TeamMemberSelectedStore = null;
    };

</script>

<aside 
    class={ ($TeamMemberSidedrawerOpenStore) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ ($TeamMemberSidedrawerOpenStore) ? 'false' : 'true'}
>
    {#key $TeamMemberSidedrawerOpenStore}
        <div class="close_button_container">
            <a href={URLPathName} data-sveltekit-noscroll>
                <button 
                    class="close_button"
                    on:click={() => closeClickHandler()}
                    on:keyup={() => closeClickHandler()}
                >
                    {@html CloseIcon}
                </button>
            </a>
        </div>
        <div>
            <picture>
                <img src={teamMember?.imageSource} alt={teamMember?.imageAltText} />
            </picture>
            <div class="info_container">
                <h2>
                    {teamMember?.name}
                </h2>
                <h3>
                    {teamMember?.title}
                </h3>
                <p>
                    {@html teamMember?.bio}
                </p>
                {#if (teamMember?.email !== null)}
                    <h4 class="info_heading">
                        email
                    </h4>
                    <a 
                        class="external_link_container"
                        href={`mailto:${teamMember?.email}`}
                    >
                        <span class="email_icon">
                            {@html EmailIcon}
                        </span>
                        <span>
                            {teamMember?.email}
                        </span>
                    </a>
                {/if}
                {#if (teamMember?.urlAddress !== null)}
                    <h4 class="info_heading">
                        website(s)
                    </h4>
                    <ul class="external_links">
                        {#each teamMember?.urlAddress as url, i}
                            <a href={url} target="_blank">
                                <li class="external_link_container">
                                    <span class="external_link_icon">
                                        {@html ExternalLinkIcon}
                                    </span>
                                    <span class="urlAddress">
                                        {url}
                                    </span>
                                </li>
                            </a>
                        {/each}
                    </ul>
                {/if}
            </div>
        </div>
    {/key}
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

    .external_links {
        list-style: none;
        margin: 0;
        padding: 0 0 1rem 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .urlAddress {
        overflow-wrap: break-word;
    }

    .external_link_container {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        margin-right: 2rem;
    }

    .external_link_icon {
        min-width: 1.5rem;
        width: 1.5rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .email_icon {
        min-width: 2.5rem;
        width: 2.5rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
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

        .external_link_icon {
            width: 1rem;
            min-width: 1rem;
        }

        .email_icon {
            min-width: 1.5rem;
            width: 1.5rem;
        }

    }

</style>