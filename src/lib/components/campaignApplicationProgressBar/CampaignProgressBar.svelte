<script lang="ts">

</script>
<ul 
    id="progress_nav_container"
>
    <li class="progress_nav_tab_container">
        <a 
            href="/authenticated-campaign/campaign/campaign-registration"
            class="progress_nav_tab"
        >
            <div 
                id="registration"
                class="circle_checkbox"
            >
            </div>
        </a>
    </li>
    <li class="progress_nav_tab_container">
        <a 
            href="/authenticated-campaign/campaign/campaign-questionnaire"
            class="progress_nav_tab"
        >
            <div 
                id="questionnaire"
                class="circle_checkbox"
            >
            </div>
        </a>
    </li>
    <li class="progress_nav_tab_container">
        <a
            href="/authenticated-campaign/campaign/campaign-submit"
            class="progress_nav_tab"
        >
            <div 
                id="submit"
                class="circle_checkbox"
            >
            </div>
        </a>
    </li>
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
        border: 2px #4C4239 solid;
        z-index: 1;
    }

    .progress_nav_heading {
        margin: 0;
        
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