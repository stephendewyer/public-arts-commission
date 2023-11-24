<script lang="ts">
    export let yearInputValue: number;
</script>

<div class="selection_container">
    <label for="election_years">
        <slot />
    </label>
    <select 
        id="election_years" 
        name="years"
        placeholder="2024"
        bind:value={yearInputValue}
    >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
        <option value="2019">2019</option>
        <option value="2018">2018</option>
        <option value="2017">2017</option>
    </select>
</div>

<style>

    .selection_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
    }

    label {
        font-size: 1.4rem;
        font-weight: 600;
        color: #1C2226;
        padding: 0 0 0.5rem 0;
    }
    
    select {
        cursor: pointer;
        background-color: #EFF9F2;
        border-radius: 3rem;
        color: #484B47;
        font-size: 1.4rem;
        padding: 0.5rem 1rem;
        border-width: 2px;
        border-color: #EFF9F2;
        border-style: solid;
        transition: border-color 0.2s linear;
        outline: none;
        width: 100%;
        max-width: 10rem;
    }

    select:hover {
        border-color: #CB6D44;
        transition: border-color 0.2s linear;
    }

    select:focus {
        border-color: #1C2226;
        transition: border-color 0.2s linear;
    }

    ::placeholder {
        color: #484B47;
        opacity: 50%; /* Firefox */
    }

    @media (max-width: 1440px) {
        select {
            font-size: 1.2rem;
        }

        label {
            font-size: 1.2rem;
            padding: 0 0 0.4rem 0;
        }
    }

    @media (max-width: 720px) {
        select {
            font-size: 1rem;
        }

        label {
            font-size: 1rem;
            padding: 0 0 0.3rem 0;
        }
    }

</style>