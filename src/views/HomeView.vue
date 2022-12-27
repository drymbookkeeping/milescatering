<template>
  <main class="maincontainer container-fluid">
    <Navbar />

    <b-container fluid class="bmenucontainer p-0">
      <b-row>
        <b-col cols ="4" sm="4" md="3" lg="2">
          <Sidebar/>
        </b-col>
        <b-col class="p-0" cols ="8" sm="8" md="9" lg="10">
          
          <b-form class="form" @submit.stop.prevent="onSubmit">
            <TopToolbar />
     
            <b-form-group id="menuName" label="Menu Name:" label-for="menu-name">
              <b-form-input width="300"></b-form-input>
            </b-form-group>

            <b-form-group id="example-input-group-2" label="Food" label-for="example-input-2">
              <b-form-select
                id="example-input-2"
                name="example-input-2"
                v-model="form.food"
                :options="foods"
                aria-describedby="input-2-live-feedback"
              ></b-form-select>
            </b-form-group>
            
          </b-form>
          
        </b-col>
      </b-row>
    </b-container>
    

  </main>
</template>

<script>
import TopToolbar from '../components/TopToolbar.vue';

export default {
    data() {
        return {
            foods: [
                { value: null, text: "Choose..." },
                { value: "apple", text: "Apple" },
                { value: "orange", text: "Orange" }
            ],
            form: {
                name: null,
                food: null
            }
        };
    },
    methods: {
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? valid : null;
        },
        resetForm() {
            this.form = {
                menuName: null,
                food: null
            };
            this.$nextTick(() => {
                this.$refs.observer.reset();
            });
        },
        onSubmit() {
            alert("Form submitted!");
        }
    },
    components: { TopToolbar }
};
</script>

<style scoped>
  .form {
    /* border: 1px solid red; */
    padding:2em;
    /* top: 75px; */
  }

  .maincontainer {
    width: 100%;
    height: 100vh;
    top: 75px;
    padding: 0px;
  }

</style>