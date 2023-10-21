<script lang="ts">
    import TeamMemberData from '$lib/data/teamMembers.json';
    import TeamMemberCard from '$lib/components/team/TeamMemberCard.svelte';

    const data: TeamMember[] = TeamMemberData;

</script>

<div class="members_container">
    {#each data as TeamMemberData, i}
        <TeamMemberCard 
            memberData={TeamMemberData}
        />
    {/each}
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