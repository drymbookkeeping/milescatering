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
                        <b-button @click="addMenu"><font-awesome-icon icon="fa-solid fa-plus" /> Add menu</b-button>
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

    <b-modal v-model="modalAddMenu" size="xl" no-close-on-backdrop="true">
        <template header-class="modal-header-vue" #header>
            <h5>ADD Menu</h5>
        </template>

        <template #default>
            <b-form class="form mb-3">
                <b-form-group label-cols="1" id="meal" label="Meal:" label-for="meal">
                    <b-form-select v-model="form.meal" :options="options" :state="menuMealState" style="width: 20%"></b-form-select>
                    <!-- This will only be shown if the preceding input has an invalid state -->
                    <b-form-invalid-feedback id="menuName-feedback">
                        meal is required
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group label-cols="1" label="Category" v-slot="{ ariaDescribedby }">
                    <b-form-radio-group
                        v-model="form.category"
                        :options="optionsRadio"
                        :aria-describedby="ariaDescribedby"
                        name="radio-options"
                        class="py-2"
                    ></b-form-radio-group>
                </b-form-group>

                <b-form-group label-cols="1" id="menuName" label="Menu:" label-for="item-code">
                    <b-form-input 
                        v-model="form.menuName"
                        :state="menuNameState"
                        trim
                    ></b-form-input>
                    <!-- This will only be shown if the preceding input has an invalid state -->
                    <b-form-invalid-feedback id="menuName-feedback">
                        Menu is required
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group label-cols="1" id="yield" label="Yield:" label-for="yield">
                    <b-form-input 
                        type="number"
                        v-model="form.yield"
                        :state="yieldState"
                        trim
                        style="width: 15%"
                    ></b-form-input>
                    <!-- This will only be shown if the preceding input has an invalid state -->
                    <b-form-invalid-feedback id="yield-feedback">
                        Pax is required
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-checkbox
                        v-model="form.solo"
                        value=1
                        unchecked-value=2
                    >
                    No Ingredients ?
                </b-form-checkbox>

            
                <div v-if="form.solo == 2">
                    <div class="d-flex mt-5" style="align-items: baseline;">
                        <b-button class="mb-3" @click="addIngredient"><font-awesome-icon icon="fa-solid fa-plus" /> Add Ingredient</b-button>
                        <p class="px-3"><b>Tolal Ingredients {{ form.ingredients?.length }}</b></p>
                    </div>

                    
                    <b-container class="header-title" fluid>
                        <b-row>
                            <b-col cols="1">  </b-col>
                            <b-col cols="3"> Ingredients </b-col>
                            <b-col cols="3"> Specification </b-col>
                            <b-col cols="1"> Raw Weight </b-col>
                            <b-col cols="1"> Net </b-col>
                            <b-col cols="1"> Unit Cost </b-col>
                            <b-col cols="2"> Cost </b-col>
                        </b-row>
                    </b-container>
                    <b-container class="" fluid v-for="(ingredient, index) in form.ingredients" :key="index">
                        <b-row>
                            <b-col class="px-0 pt-1" cols="1"><b-button @click="remove(index)" class="operation mr-1" variant="outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></b-button></b-col>
                            <b-col class="p-0" cols="3"><VueMultiselect  :options="items" label="itemName" v-model="ingredient.item" @Select="checkItemIfExist"></VueMultiselect></b-col>
                            <b-col class="p-0" cols="3"><b-form-input v-model="ingredient.specification" trim></b-form-input></b-col>
                            <b-col class="p-0" cols="1"><b-form-input v-model="ingredient.raw_weight" trim></b-form-input></b-col>
                            <b-col class="p-0" cols="1"><b-form-input v-model="ingredient.net" trim @input="handleInput(ingredient)"></b-form-input></b-col>
                            <b-col class="p-0" cols="1"><b-form-input v-model="ingredient.unit_cost" trim @input="handleInput(ingredient)"></b-form-input></b-col>
                            <b-col class="p-0" cols="2"><b-form-input v-model="ingredient.cost" trim disabled></b-form-input></b-col>
                        </b-row>
                    </b-container>
                    <h4 class="text-right"><b>Total cost: {{ totalAmount }}</b></h4>
                </div>

                <b-form-group class="mt-5" label-cols="1" id="garnish" label="Garnish:" label-for="yield">
                    <b-form-textarea
                        id="textarea"
                        v-model="form.garnish"
                        rows="3"
                        max-rows="6"
                    ></b-form-textarea>
                </b-form-group>

                <b-form-group class="" label-cols="1" id="miseenplace" label="Mise en place:" label-for="yield">
                    <b-form-textarea
                        id="textarea"
                        v-model="form.miseenplace"
                        rows="3"
                    ></b-form-textarea>
                </b-form-group>

                <b-form-group class="" label-cols="1" id="method" label="Method:" label-for="yield">
                    <b-form-textarea
                        id="textarea"
                        v-model="form.method"
                        rows="5"
                    ></b-form-textarea>
                </b-form-group>
                
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
import type { Header, Item, ServerOptions  } from "vue3-easy-data-table";

let records: Item = [];
let items: Item = [];
let form: Item = [];
let selectedItem: Item[] = [];


const listHeader: Header[] = [
    { text: "Operation", value: "operation", width: 110},
    { text: "Meal", value: "meal"},
    { text: "Category", value: "category"},
    { text: "Menu", value: "menuName"},
    { text: "Yield", value: "yield", width: 50},
    { text: "Garnish", value: "garnish"},
    { text: "Mis en place", value: "miseenplace"},
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
            modalAddMenu: false,
            form: {
                menuName: '',
                yield: '',
                meal: 'Breakfast',
                category: 3,
                solo: 2,
                garnish: '',
                miseenplace: '',
                method: '',
                ingredients: <any[]>([]) 
            },
            options: [
                { value: 'Breakfast', text: 'Breakfast' },
                { value: 'AM Snacks', text: 'AM Snacks' },
                { value: 'Lunch', text: 'Lunch' },
                { value: 'PM Snacks', text: 'PM Snacks' },
                { value: 'Dinner', text: 'Dinner' },
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
                menuName: '',
                yield: '',
                meal: '',
                category: '',
                garnish: '',
                miseenplace: '',
                method: '',
                ingredients: [],
                solo: 2
            };
            this.refreshDatatable()
            this.modalAddMenu=false;
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
        addMenu() {
            this.modalAddMenu = !this.modalAddMenu;
        },
        addIngredient() {
            this.form.ingredients.unshift({
                ingredient:'',
                specification:'',
                raw_weight:'',
                rawWeight:'',
                net:0.00,
                unit_cost:0.00,
                cost:0.00,
            });
            
        }
        ,refreshDatatable(){
            axios.get("http://127.0.0.1:8000/api/menu")
            .then(res => {
                this.records = res.data;
            })
            .catch(error => {
                console.log(error)
            });

            this.addIngredient()
        }
        ,getItems(){
            axios.get("http://127.0.0.1:8000/api/item")
            .then(res => {
                this.items = res.data;
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

        ,retrieveIngredient(item: Item) {
            axios.get("http://127.0.0.1:8000/api/menuIngredient/"+item.id)
            .then(res => {
               if(res.status === 200) {
                this.edited = 1;
                this.form.ingredients = res.data;
                this.modalAddMenu = true
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

        ,checkItemIfExist(item,id) {
            console.log(item,id)
        }
    },
    computed: {
        menuNameState() {
            return this.form.menuName.length > 1 ? true : false
        },
        yieldState() {
            return this.form.yield.length > 1 ? true : false
        },
        menuMealState() {
            return this.form.meal.length > 1 ? true : false
        },
        totalAmount() {
            var sum = 0;
            if(this.form.ingredients?.length > 0) {
                this.form.ingredients.forEach(e => {
                    let cost = e.cost;
                    sum += parseFloat(cost.toString().replace(/,/g, '')) ;
                });
            }
            
            return sum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
    }
    ,mounted() {
        this.refreshDatatable()
        this.getItems()
    }
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