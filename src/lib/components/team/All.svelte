<script lang="ts">
    import TeamPanel from '$lib/components/team/TeamPanel.svelte';
    import TeamMemberCard from '$lib/components/team/TeamMemberCard.svelte';

</script>

<TeamPanel let:data >
    {#each data as TeamMemberData, i}
        <TeamMemberCard memberData={TeamMemberData} />
    {/each}
</TeamPanel>


<style>

</style>