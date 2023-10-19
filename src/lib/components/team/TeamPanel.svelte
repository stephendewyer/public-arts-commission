<script lang="ts">

    const TeamData: TeamMember[] = [
        {
            index: 1,
            imageSource: "/assets/images/people/Frances_Cathryn.jpg",
            imageAltText: "Frances Cathryn",
            name: "Frances Cathryn",
            title: "Board Director",
            board_director: true,
            staff: false
        },
        {
            index: 2,
            imageSource: "/assets/images/people/Oreen_Cohen_profile.jpg",
            imageAltText: "Oreen Cohen",
            name: "Oreen Cohen",
            title: "Board Director",
            board_director: true,
            staff: false
        },
        {
            index: 3,
            imageSource: "/assets/images/people/stephen_dewyer_profile.jpg",
            imageAltText: "stephen dewyer",
            name: "stephen dewyer",
            title: "Founder, UX Designer, Full-stack Web Developer and Board Director",
            board_director: true,
            staff: true
        },
        {
            index: 4,
            imageSource: "/assets/images/people/Miles_Huston_profile.jpg",
            imageAltText: "Miles Huston",
            name: "Miles Huston",
            title: "Board Director",
            board_director: true,
            staff: false
        },
        {
            index: 5,
            imageSource: "/assets/images/people/Tatyana_Kurepina.jpg",
            imageAltText: "Tatyana Kurepina",
            name: "Tatyana Kurepina",
            title: "Board Director",
            board_director: true,
            staff: false
        },
        {
            index: 6,
            imageSource: "/assets/images/people/Key_Jo_Lee_profile_image_square.jpg",
            imageAltText: "Key Jo Lee",
            name: "Key Jo Lee",
            title: "Board Director",
            board_director: true,
            staff: false
        },
        {
            index: 6,
            imageSource: "/assets/images/people/Clynton_Lowry_profile.jpg",
            imageAltText: "Clynton Lowry",
            name: "Clynton Lowry",
            title: "Board Director",
            board_director: true,
            staff: false
        }
    ]

</script>

<div class="members_container">
    <slot data={TeamData}/>
</div>

<style>
    .members_container {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 1rem;
        padding: 1rem;
    }

    @media (max-width: 1440px) {
        
    }

    @media (max-width: 720px) {
        .members_container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-wrap: nowrap;
            justify-content: flex-start;
            gap: 1rem;
            padding: 1rem;
        }
    }
</style>