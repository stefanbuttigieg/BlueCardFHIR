// src/routes.js
import Home from './Home.svelte';
import AddPatient from './AddPatient.svelte';
import EditPatient from './EditPatient.svelte';

export const routes = {
  '/': Home,
  '/add-patient': AddPatient,
  '/edit-patient/:id': EditPatient,
}; 
