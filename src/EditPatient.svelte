<script lang="ts">
  import { onMount } from 'svelte';
  import axios, { AxiosError } from 'axios';
  import page from 'svelte-spa-router';

  export let id: string;

  const fhirBaseUrl = 'https://fhir-bootcamp.medblocks.com/fhir';
  // let id = '';
  let name = '';
  let gender = '';
  let birthDate = '';
  let phoneNumber = '';

  const navigateHome = () => {
    page.navigate('/');
  };
  
  const fetchPatient = async (patientId) => {
    try {
      console.log('Fetching patient with ID:', patientId);
      const response = await axios.get(`${fhirBaseUrl}/Patient/${patientId}`);
      const patient = response.data;

      id = patient.id;
      name = `${patient.name[0].given.join(' ')} ${patient.name[0].family}`;
      gender = patient.gender;
      birthDate = patient.birthDate;
      phoneNumber = patient.telecom[0]?.value || '';
      console.log('Fetched patient:', patient);
    } catch (error: AxiosError) {
      console.error('Error fetching patient:', error.message);
    }
  };

  const updatePatient = async () => {
    const [givenName, ...familyNameParts] = name.split(' ');
    const familyName = familyNameParts.join(' ');

    const navigateHome = () => {
      page.navigate('/');
    };
    
    const updatedPatient = {
      resourceType: 'Patient',
      id,
      name: [{
        use: 'official',
        family: familyName,
        given: [givenName]
      }],
      gender,
      birthDate,
      telecom: [{
        system: 'phone',
        value: phoneNumber,
        use: 'mobile'
      }]
    };

    try {
      console.log('Updating patient:', updatedPatient);
      await axios.put(`${fhirBaseUrl}/Patient/${id}`, updatedPatient);
      window.location.href = '/';
    } catch (error: AxiosError) {
      console.error('Error updating patient:', error.message);
    }
  };

  onMount(() => {
    console.log("Mounting");
    console.log(id);
    

    const patientId = id;
    fetchPatient(patientId);
  });
</script>

<main>
  <div class="max-w-md mx-auto my-10">
    <h1 class="text-3xl font-bold text-center">Edit Patient</h1>
    <form on:submit|preventDefault={updatePatient} class="mb-8">
      <div class="mb-4">
        <label class="block mb-2" for="name">Name:</label>
        <input id="name" type="text" bind:value={name} required class="input"/>
      </div>
      <div class="mb-4">
        <label class="block mb-2" for="gender">Gender:</label>
        <select id="gender" bind:value={gender} required class="input">
          <option value="" disabled>Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block mb-2" for="birthDate">Date of Birth:</label>
        <input id="birthDate" type="date" bind:value={birthDate} required class="input"/>
      </div>
      <div class="mb-4">
        <label class="block mb-2" for="phoneNumber">Phone Number:</label>
        <input id="phoneNumber" type="tel" bind:value={phoneNumber} required class="input"/>
      </div>
      <button type="submit" class="btn">Update Patient</button>
      <a href="/" class="btn btn-secondary">Go Back Home</a>
    </form>
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
  .btn {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    margin-top: 10px;
  }
  .btn:hover {
    background-color: #0056b3;
  }
  .btn-secondary {
    background-color: #6c757d;
  }
  .btn-secondary:hover {
    background-color: #5a6268;
  }
</style>
