

<template>
  <main>
    <Navbar />

    <div style="display:flex;">
      <Sidebar/>

      <div>
        <b-form class="form" @submit.stop.prevent="onSubmit">
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button class="ml-2" @click="resetForm()">Reset</b-button>


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
      </div>
    </div>
    

  </main>
</template>

<script>
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
  }
};
</script>

<style scoped>
  .form {
    border: 1px solid gray;
    padding:2em;
  }
</style>