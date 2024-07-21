<script lang="ts">
  import axios, { AxiosError } from 'axios';
  import { fhirBaseUrl } from './utils';

  let name = '';
  let gender = '';
  let birthDate = '';
  let phoneNumber = '';

  const createPatient = async () => {
    const [givenName, ...familyNameParts] = name.split(' ');
    const familyName = familyNameParts.join(' ');

    const newPatient = {
      resourceType: 'Patient',
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
      console.log('Creating patient:', newPatient);
      await axios.post(`${fhirBaseUrl}/Patient`, newPatient);
      location.href = '/';
    } catch (error: AxiosError) {
      console.error('Error creating patient:', error.message);
    }
  };

  const resetForm = () => {
    name = '';
    gender = '';
    birthDate = '';
    phoneNumber = '';
  };
</script>

<main>
  <div class="max-w-md mx-auto my-10">
    <h1 class="text-3xl font-bold text-center">Add New Patient</h1>
    <form on:submit|preventDefault={createPatient} class="mb-8">
      <div class="mb-4">
        <label class="block mb-2" for="name">Name:</label>
        <input id="name" type="text" bind:value={name} required class="input"/>
      </div>
      <div class="mb-4">
        <label class="block mb-2" for="gender">Gender:</label>
        <select id="gender" bind:value={gender} required class="input">
          <option value="" disabled selected>Select gender</option>
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
      <button type="submit" class="btn">Add Patient</button>
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
