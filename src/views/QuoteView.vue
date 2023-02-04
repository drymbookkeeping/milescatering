<template>
    <main class="maincontainer container-fluid">
      <Navbar />
      <b-container fluid class="bmenucontainer p-0">
          <b-row>
              <b-col cols ="4" sm="4" md="3" lg="2">
                  <Sidebar/>
              </b-col>
  
              <b-col class="px-2" cols ="8" sm="8" md="9" lg="10">
                

                  <div class="mt-5 px-2">
                      <b-input-group size="sm" class="mb-2">
                          <b-input-group-prepend is-text>
                              <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                          </b-input-group-prepend>
                          <b-form-input type="search" placeholder="Search terms"  v-model="searchMenu"></b-form-input>
                          <b-button @click="addQuote"><font-awesome-icon icon="fa-solid fa-plus" /> Add Quote</b-button>
                      </b-input-group>
  
                      <EasyDataTable
                          :headers="listHeader"
                          :items="records"
                          border-cell
                          table-class-name="customize-table"
                          :table-height="500"
  
                          :search-field="searchMenuField"
                          :search-value="searchMenu"
  
                          :rows-per-page="10"
                          buttons-pagination
                      >
  
                      <template #item-operation="item">
                          <div class="operation-wrapper">
                              <b-button @click="toggle(item)" class="operation mr-1" variant="outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></b-button>
                              <b-button @click="retrieveRecord(item)" class="operation" variant="outline-info"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></b-button>
                          </div>
                      </template>
                      </EasyDataTable>
                  </div>

              </b-col>
          </b-row>
      </b-container>
  
      <b-modal v-model="modalAddQuote" size="xl" no-close-on-backdrop="true">
          <template header-class="modal-header-vue" #header>
              <h5>ADD QUOTE</h5>
          </template>
  
          <template #default>
              <b-form class="form mb-3">
                <b-form-group label-cols="1" label="Start/End:">
                    <Datepicker range multi-calendars text-input model-type="dd.MM.yyyy" v-model="form.startDate" />
                </b-form-group>

                <b-form-group label-cols="1" label="Meals:">
                    <b-form-checkbox-group
                        v-model="form.meal"
                        :options="options"
                        :state="mealState"
                        class="pt-2"
                    ></b-form-checkbox-group>
                </b-form-group>
                
                <b-form-group label-cols="1" id="client" label="Client:" label-for="item-code">
                    <b-form-input 
                        v-model="form.client"
                        :state="clientState"
                        trim
                    ></b-form-input>
                    <!-- This will only be shown if the preceding input has an invalid state -->
                    <b-form-invalid-feedback id="client-feedback">
                        Client is required
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group label-cols="1" id="venue" label="Venue:" label-for="item-code">
                    <b-form-input 
                        v-model="form.venue"
                        :state="venueState"
                        trim
                    ></b-form-input>
                    <!-- This will only be shown if the preceding input has an invalid state -->
                    <b-form-invalid-feedback id="venue-feedback">
                        Venue is required
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group label-cols="1" id="pax" label="Pax:" label-for="pax">
                    <b-form-input 
                        type="number"
                        v-model="form.pax"
                        :state="paxState"
                        trim
                        style="width: 15%"
                    ></b-form-input>
                    <!-- This will only be shown if the preceding input has an invalid state -->
                    <b-form-invalid-feedback id="pax-feedback">
                        Pax is required
                    </b-form-invalid-feedback>
                </b-form-group>

                <button class="btn btn-primary" @click="generate">Generate daily menu</button>
              </b-form>
          </template>
  
          <template #footer>
              <button class="btn btn-primary" @click="saveMenu">Save</button>
              <button class="btn btn-primary" @click="resetForm">Cancel</button>
          </template>
      </b-modal>
  
      
      <!-- ALERT MESSAGE -->
      <b-modal v-model="alertModal" no-close-on-backdrop="true">
          <template #header>
              <h5>Operation Message</h5>
          </template>
  
          <template #default>
              <p> {{ alertMessage }}</p>
          </template>
  
          <template #footer>
              <button class="btn btn-primary" @click="this.alertModal=false">Ok</button>
          </template>
      </b-modal>
  
      <b-modal v-model="modalShow" no-close-on-backdrop="true">
          <template #header>
              <h5>Are you sure to delete this item?</h5>
          </template>
  
          <template #default>
              <p>Menu: {{ this.selectedItem.menuName }}</p>
              <p>Yield: {{ this.selectedItem.yield }}</p>
          </template>
  
          <template #footer>
              <button class="btn btn-primary" @click="deleteRecord">Yes</button>
              <button class="btn btn-primary" @click="this.modalShow=false">Cancel</button>
          </template>
      </b-modal>
    </main>
  </template>
  
  <script lang="ts">
    import axios from "axios";
    import { ref, computed, watch, reactive } from "vue";
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';

  
  let records: Item = [];
  let items: Item = [];
  let form: Item = [];
  let selectedItem: Item[] = [];
  
  
  const listHeader: Header[] = [
      { text: "Operation", value: "operation", width: 110},
      { text: "RFQ #", value: "meal", width: 110},
      { text: "Pax", value: "meal", width: 110},
      { text: "Start Date", value: "meal", width: 110},
      { text: "End Date", value: "meal", width: 110},
      { text: "Client", value: "meal"},
      { text: "Venue", value: "meal"},
  ];
  const searchMenuField = ["menuName", "garnish"];
  let searchMenu = ref();
  let alertMessage: String ="";
  let edited = 0;
  
  export default {
      
      data() {
          return {
              listHeader,
              records,
              searchMenu,
              searchMenuField,
              modalAddQuote: false,
              form: {
                    startDate: '',
                    meal: [],
                    client: '',
                    venue: '',
                    pax: 0,
                    dailyMenu: <any[]>([]) 
              },
              options: [
                  { text: 'Breakfast', value: 'Breakfast' },
                  { text: 'AM Snacks', value: 'AMSnacks' },
                  { text: 'Lunch', value: 'Lunch' },
                  { text: 'PM Snacks', value: 'PMSnacks' },
                  { text: 'Dinner', value: 'Dinner' },
              ],
              optionsRadio:[
                  { text: 'Beverage', value:'Beverage' },
                  { text: 'Desert', value:'Desert' },
                  { text: 'Food', value:'Food' },
              ],
              items,
              alertModal: false,
              modalShow: false,
              alertMessage,
              selectedItem,
              edited
          };
      },
      methods: {
          resetForm() {
              this.form = {
                    startDate: '',
                    meal: [],
                    client: '',
                    venue: '',
                    pax: 0,
              };
              this.refreshDatatable()
              this.modalAddQuote=false;
          },
          saveMenu() {
              axios.post("http://127.0.0.1:8000/api/menu",this.form)
              .then(res => {
                  if(res) {
                      this.alertMessage = true;
                      this.toggleAlert('Successfully saved.');
                      this.resetForm()
                  }
              })
              .catch(error => {
                  console.log(error)
              });
          },
          addQuote() {
              this.modalAddQuote = !this.modalAddQuote;
          }
          ,refreshDatatable(){
              axios.get("http://127.0.0.1:8000/api/menu")
              .then(res => {
                  this.records = res.data;
              })
              .catch(error => {
                  console.log(error)
              });
  
          }
          ,toggle(item: Item){
              this.selectedItem = item;
              this.modalShow = !this.modalShow;
          }
          ,deleteRecord(){
              axios.delete("http://127.0.0.1:8000/api/menu/"+this.selectedItem.id)
              .then(res => {
                 if(res.status === 200) {
                      this.toggleAlert('Successfully deleted.')
                      this.refreshDatatable();
                 }
              })
              .catch(error => {
                  console.log(error)
              });
              
              this.modalShow =false;
          }
  
          ,retrieveRecord(item: Item) {
              axios.get("http://127.0.0.1:8000/api/menu/"+item.id)
              .then(res => {
                 if(res.status === 200) {
                  this.form = res.data;
                  this.retrieveIngredient(item);
                 }
              })
              .catch(error => {
                  console.log(error)
              });
              
          }
         
          ,remove(index) {
              this.form.ingredients = this.form.ingredients.filter((p, i) => {
                  return i !== index;
              });
          }
          ,handleInput(ingredient) {
              let net = parseFloat(ingredient.net);
              ingredient.cost =  this.formatPrice(net * ingredient.unit_cost);
          }
          ,formatPrice(value) {
              let val = (value/1).toFixed(2)
              return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          ,toggleAlert(message: String){
              this.alertMessage = message
              this.alertModal = !this.alertModal;
          }
          ,generate() {
            let day = this.form.startDate;
            let startDate = new Date(day[0])
            let endDate = new Date(day[1])
            let daysdiff = ((endDate - startDate) / (1000*60*60*24)).toFixed(0)


            console.log(this.form.meal)
            console.log(daysdiff)
          }
      },
      computed: {
        totalAmount() {
            var sum = 0;
            if(this.form.ingredients?.length > 0) {
                this.form.ingredients.forEach(e => {
                    let cost = e.cost;
                    sum += parseFloat(cost.toString().replace(/,/g, '')) ;
                });
            }
            
            return this.formatPrice(sum)
        }
        ,mealState() {
            return this.form.meal?.length > 0
        }
        ,clientState() {
            return this.form.client?.length > 0
        }
        ,venueState() {
            return this.form.venue?.length > 0
        }
        ,paxState() {
            return this.form.pax?.length > 0
        }
      }
      ,mounted() {
          this.refreshDatatable()
      }
      ,components: { Datepicker },
  }
  </script>
  
  <style>
      .maincontainer {
          width: 100%;
          height: 100vh;
          top: 75px;
          padding: 0px;
      }
  
      .customize-table {
          --easy-table-header-background-color : #192a56;
          --easy-table-header-font-color: white;
          --easy-table-header-font-size: 14px;
          --easy-table-body-row-font-size: 14px;
  
          --easy-table-footer-background-color: #192a56;
          --easy-table-footer-font-color: white;
  
          --easy-table-border: 1px solid black;
  
          --easy-table-row-border: 1px solid #636e72;
  
      }
  
      .operation{
          width: 35px;
          padding: 0px;
          height: 30px;
      }
  
      .toolbar-button {
          width: 110px;
          font-size: 17px;
      }
  
      hr {
          background-color: #f1c40f;
      }
  
      .header-title > div > div{
          font-size: 1em;
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          border: 1px solid gray;
      }
  
      .toptoolbar{
          position: fixed;
          z-index: 1;
          border-bottom: 1px solid black;
          width: 100%;
          padding-bottom: 10px;
          background: white;
          margin-top: 2px;
          padding-top: 20px;
      }
  
  </style>
  
  <style src="vue-multiselect/dist/vue-multiselect.css"></style>