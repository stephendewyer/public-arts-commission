<script lang="ts">
    import CheckMark from '$lib/images/icons/checkmark.svg?raw';
    import { page } from '$app/state';

    export let nav_paths: NavPath[];

    let activePage: number = 0;

    if (page.url.pathname.split("/")[2] === "campaign-questionnaire") {

        activePage = 2;

    } else if (page.url.pathname.split("/")[2] === "campaign-registration") {

        activePage = 1;

    } else if (page.url.pathname.split("/")[2] === "campaign-submit") {

        activePage = 3;

    } else {

        activePage = 0;

    };


</script>
<ul 
    id="progress_nav_container"
>
    {#each nav_paths as navTab, i}
        <li class="progress_nav_tab_container">
            {#if 
                (navTab.id === "questionnaire" || navTab.id === "submit") &&
                !nav_paths[0].completed
            }
                <div 
                    class="progress_nav_tab"
                >
                    <div 
                        id={navTab.id}
                        class="circle_checkbox"
                        style="background-color: gray;"
                    >
                        {#if (navTab.completed)}
                            <div class="checkmark">
                                {@html CheckMark}
                            </div>
                        {/if}
                    </div>
                </div>
            {:else if 
                (navTab.id === "submit") &&
                !nav_paths[1].completed
            }
                <div 
                    class="progress_nav_tab"
                >
                    <div 
                        id={navTab.id}
                        class={activePage === (i + 1) ? "circle_checkbox_active" : "circle_checkbox"}
                        style="background-color: gray;"
                    >
                        {#if (navTab.completed)}
                            <div class="checkmark">
                                {@html CheckMark}
                            </div>
                        {/if}
                    </div>
                </div>
            {:else}
                <a 
                    href={navTab.path}
                    class="progress_nav_tab"
                >
                    <div 
                        id={navTab.id}
                        class={activePage === (i + 1) ? "circle_checkbox_active" : "circle_checkbox"}
                        style={navTab.completed ? "background-color: #D1E9D1;" : "background-color: #FDF6EF"}
                    >
                        {#if (navTab.completed)}
                            <div class="checkmark">
                                {@html CheckMark}
                            </div>
                        {/if}
                    </div>
                </a>
            {/if}
        </li>
    {/each}
</ul>

<style>
    ul {
        position: relative;
        list-style: none;
        margin: 0;
        /* left and right padding must match left and right of pseudo element line */
        padding: 1rem 2rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        max-width: 40rem;
    }

    .progress_nav_tab {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .circle_checkbox {
        position: relative;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        background-color: #FDF6EF;
        border: 1px #4C4239 solid;
        z-index: 1;
    }

    .circle_checkbox_active {
        position: relative;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        background-color: #FDF6EF;
        border: 2px #4C4239 solid;
        z-index: 1;
    }

    .checkmark {
        position: relative;
        margin: 0;
        width: 100%;
        height: 100%;
        padding: 0.25rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #progress_nav_container:after {
        position: absolute;
        content: '';
        /* left and right must match padding of container element */
        right:  2rem;
        left: 2rem;
        top: 0%;
        height: 50%;
        border-bottom: 2px solid black;
    }

    #registration::after {
        content: 'registration';
        position: absolute;
        top: 1.75rem;
        font-weight: 600;
        /* move right by 50% of containers width */
        left: 50%;
        /* move left by 50% of own width */
        transform: translateX(-50%);
        font-size: 1.2rem;
    }

    #questionnaire::after {
        content: 'questionnaire';
        position: absolute;
        top: 1.75rem;
        font-weight: 600;
        /* move right by 50% of containers width */
        left: 50%;
        /* move left by 50% of own width */
        transform: translateX(-50%);
        font-size: 1.2rem;
    }

    #submit::after {
        content: 'submit';
        position: absolute;
        top: 1.75rem;
        font-weight: 600;
        /* move right by 50% of containers width */
        left: 50%;
        /* move left by 50% of own width */
        transform: translateX(-50%);
        font-size: 1.2rem;
    }

    @media (max-width: 1140px) {
        #registration::after {
            font-size: 1rem;
        }

        #questionnaire::after {
            font-size: 1rem;
        }

        #submit::after {
            font-size: 1rem;
        }
    }

    @media (max-width: 720px) {
        #registration::after {
            font-size: 0.8rem;
        }

        #questionnaire::after {
            font-size: 0.8rem;
        }

         #submit::after {
            font-size: 0.8rem;
        }  

    }

</style>