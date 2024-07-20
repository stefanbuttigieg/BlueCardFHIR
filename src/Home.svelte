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

      const fetchPatients = async () => {
        try {
          const patientResponse = await axios.get(`${fhirBaseUrl}/Patient`);
          patients = patientResponse.data.entry?.map(entry => entry.resource) ?? [];
          searchResults.set(patients);
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

      onMount(() => {
        fetchPatients();
      });

      $: if (searchQuery === '') {
        searchResults.set(patients);
      } else {
        searchPatients();
      }
    </script>

    <main>
      <div class="max-w-md mx-auto my-10">
        <h1 class="text-3xl font-bold text-center">Blue Card</h1>
        <a href="/add-patient" class="btn">Add New Patient</a>
        <input
          type="text"
          class="input"
          placeholder="Search by name or phone number"
          bind:value={searchQuery}
        />
        {#if loading}
          <p>Loading...</p>
        {:else if errorMessage}
          <p>{errorMessage}</p>
        {:else}
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
        {/if}
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
        padding: 10px;
        background-color: #007BFF;
        color: white;
        text-align: center;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 10px;
        text-decoration: none;
      }
      .btn:hover {
        background-color: #0056b3;
      }
    </style>
