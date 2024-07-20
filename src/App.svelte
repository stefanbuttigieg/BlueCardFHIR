<!-- src/App.svelte -->
<script>

  import { Router, Route} from 'svelte-routing';
  import Home from './Home.svelte';

  import AddPatient from './AddPatient.svelte';
  import EditPatient from './EditPatient.svelte'
</script>
 <Router>
<main>
 
    <Route path="/">
      <Home />
    </Route>
    <Route path="/add-patient">
      <AddPatient />
    </Route>
    <Route path="/edit-patient/:id" component={EditPatient}></Route>

  

</main>
   </Router>

<style>
  /* Global styles go here */
</style>
