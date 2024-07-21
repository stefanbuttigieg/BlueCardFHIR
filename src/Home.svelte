<script lang="ts">
  import { onMount } from 'svelte';
  import axios, { AxiosError } from 'axios';
  import { writable } from 'svelte/store';

  const fhirBaseUrl = 'https://fhir-bootcamp.medblocks.com/fhir';
  let patients = [];
  let loading = true;
  let errorMessage = '';
  let searchQuery = '';
  const searchResults = writable([]);
  let currentPage = 1;
  let postsPerPage = 10;
  let totalPatients = 0;

  const fetchPatients = async (pageNumber = 1) => {
    try {
      const patientResponse = await axios.get(`${fhirBaseUrl}/Patient?_count=100`);
      patients = patientResponse.data.entry?.map(entry => entry.resource) ?? [];
      totalPatients = patients.length;
      searchResults.set(patients.slice((pageNumber - 1) * postsPerPage, pageNumber * postsPerPage));
    } catch (error: AxiosError) {
      if (error.response) {
        console.error('Error fetching patients:', error.message);
        console.log('Status code:', error.response.status);
        console.log('Response data:', error.response.data);
        errorMessage = `Error fetching patients: ${error.message}`;
      } else if (error.request) {
        console.error('Error making the request:', error.message);
        errorMessage = `Error making the request: ${error.message}`;
      } else {
        console.error('Error setting up the request:', error.message);
        errorMessage = `Error setting up the request: ${error.message}`;
      }
    } finally {
      loading = false;
    }
  };

  const searchPatients = () => {
    const query = searchQuery.toLowerCase();
    const results = patients.filter(patient => {
      const name = `${patient.name?.[0]?.given?.join(' ')} ${patient.name?.[0]?.family}`.toLowerCase();
      const phone = patient.telecom?.[0]?.value?.toLowerCase() || '';
      return name.includes(query) || phone.includes(query);
    });
    searchResults.set(results);
  };

  const changePage = (pageNumber) => {
    currentPage = pageNumber;
    fetchPatients(currentPage); 
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(totalPatients / postsPerPage)) {
      changePage(currentPage + 1);
    }
  };

  onMount(() => {
    fetchPatients();
  });

  $: if (searchQuery === '') {
    // Update searchResults with the sliced data based on currentPage
    searchResults.set(patients.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage));
  } else {
    searchPatients();
  }
</script>

<main>
  <div class="max-w-md mx-auto my-10">
    <div class="header-container">
    <h1 class="text-3xl font-bold text-center">Blue Card</h1>
    <div class="search-container"> <!-- New container for search -->
      <input
        type="text"
        class="input"
        placeholder="Search by name or phone number"
        bind:value={searchQuery}
      />
      <a href="/add-patient" class="btn add-patient-button">Add New Patient</a>
    </div>
    </div>
    {#if loading}
      <p>Loading...</p>
    {:else if errorMessage}
      <p>{errorMessage}</p>
    {:else}
      <div class="patient-list-container">
      {#each $searchResults as patient}
        <div class="patient-card">
          <p>ID: {patient?.id}</p>
          <p>Name: {patient?.name?.[0]?.given?.join(' ')} {patient?.name?.[0]?.family}</p>
          <p>Gender: {patient?.gender}</p>
          <p>Date of Birth: {patient?.birthDate}</p>
          <p>Phone: {patient?.telecom?.[0]?.value}</p>
          <a href={`/edit-patient/${patient.id}`} class="btn">Edit</a>
        </div>
      {/each}
      </div>
    {/if}
    <div class="pagination">
      <button on:click={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
      <button on:click={goToNextPage} disabled={currentPage === Math.ceil(totalPatients / postsPerPage)}>Next</button>
    </div>
  </div>
</main>

<style>
  .input {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    margin-bottom: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .patient-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  .btn {
    display: block;
    width: 100%;
    padding: 10px 10px 10px 10px;
    background-color: #007BFF;
    color: white;
    text-align: center;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 10px;
    text-decoration: none;
  }
  .btn:hover {
    background-color: #0056b3;
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .pagination button {
    display: inline-block;
    width: auto;
    padding: 10px 10px 10px 10px;
    background-color: #007BFF;
    color: white;
    text-align: center;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 10px;
    text-decoration: none;
    margin-right: 10px;
  }
  .pagination button:hover {
    background-color: #0056b3;
  }
  /* Responsive Styles */
  @media (min-width: 768px) { /* Styles for screens wider than 768px */
    .max-w-md { /* Adjust the max width of the content container */
      max-width: 700px;
      /* Remove flexbox from the .max-w-md container */
    }
    .add-patient-button {
      margin-left: auto; /* Push the button to the right */
    }
    .patient-list-container { /* New container for patient cards */
      display: flex;
      flex-direction: column; /* Stack patient cards vertically */
    }
    .patient-card {
      display: flex; /* Use flexbox for the patient cards */
      align-items: center; /* Align items vertically */
      justify-content: space-between; /* Distribute space between elements */
    }
    .patient-card p {
      margin-right: 20px; /* Add space between elements */
    }
    .patient-card a {
      margin-left: 20px; /* Add space between elements */
    }
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .pagination button {
      width: 100px; /* Set a fixed width for the pagination buttons */
    }
    .search-container { /* New container for the search bar */
      display: flex;
      align-items: center; /* Align search and button vertically */
    }
    .search-container input {
      width: 200px;
      margin-right: 10px; /* Add spacing between search bar and button */
    }
    .header-container { /* New container for the title, search, and add button */
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
  }
</style>