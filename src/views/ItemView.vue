<template>
    <main class="maincontainer container-fluid">
        <Navbar />

        <b-container fluid class="bmenucontainer p-0">
            <b-row>
                <b-col cols ="4" sm="4" md="3" lg="2">
                    <Sidebar/>
                </b-col>

                <b-col class="p-0" cols ="8" sm="8" md="9" lg="10">

                    <TopToolbar />

                    <b-form class="form">
                        <b-form-group label-cols="1" id="itemCode" label="Code:" label-for="item-code">
                            <b-form-input 
                                v-model="form.itemCode"
                                :state="codeState"
                                trim
                                style="width: 30%"
                            ></b-form-input>

                            <!-- This will only be shown if the preceding input has an invalid state -->
                            <b-form-invalid-feedback id="itemCode-feedback">
                                Code is required
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group label-cols="1" id="itemName" label="Name:" label-for="item-name">
                            <b-form-input
                                v-model="form.itemName"
                                :state="itemNameState"
                                trim
                            ></b-form-input>

                            <b-form-invalid-feedback id="itemName-feedback">
                                Name is required
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </b-form>
                    
                    <div class="form">
                        <b-input-group size="sm" class="mb-2">
                            <b-input-group-prepend is-text>
                                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                            </b-input-group-prepend>
                            <b-form-input type="search" placeholder="Search terms"  v-model="searchValue"></b-form-input>
                        </b-input-group>

                        <EasyDataTable
                            :headers="headers"
                            :items="items"
                            border-cell
                            table-class-name="customize-table"
                            :table-height="290"

                            :search-field="searchField"
                            :search-value="searchValue"

                            :rows-per-page="7"
                            :theme-color="themeColor"
                            buttons-pagination
                        >

                        <template #item-operation="item">
                            <div class="operation-wrapper">
                                <b-button @click="deleteItem(item)" class="operation mr-1" variant="outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></b-button>
                                <b-button class="operation" variant="outline-info"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></b-button>
                            </div>
                        </template>
                        </EasyDataTable>
                        
                    </div>
                </b-col>
                

            </b-row>
        </b-container>

        
    </main>
</template>

<script lang="ts">
    import TopToolbar from '../components/TopToolbar.vue';
    import type { Header, Item, ServerOptions  } from "vue3-easy-data-table";
    import { ref, computed, watch } from "vue";
    import axios from "axios";

    const headers: Header[] = [
        { text: "Operation", value: "operation", width: 110},
        { text: "Code", value: "itemCode", width: 100},
        { text: "Name", value: "itemName", sortable: true},
        
    ];

    let items: Item[] = [];

    const searchField = ["itemCode", "itemName"];
    let searchValue = ref();
    const themeColor = "#f1c40f";
    
   

    export default {
    
        data() {
            return {
                form: {
                    itemName: '',
                    itemCode: ''
                },
                headers,
                items,
                searchField,
                searchValue,
                themeColor,
                deleteItem
            };
        },
        
        computed: {
            codeState() {
                return this.form['itemCode'].length > 1 ? true : false
            },
            itemNameState() {
                return this.form['itemName'].length > 1 ? true : false
            }
        },
        methods: {
            getValidationState({ dirty, validated, valid = null }) {
                return dirty || validated ? valid : null;
            },
            resetForm() {
                this.form = {
                    itemName: null,
                    itemCode: null
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
        ,mounted() {
            axios.get("http://127.0.0.1:8000/api/item")
            .then(res => {
                this.items = res.data;
            })
            .catch(error => {
                console.log(error)
                // Manage errors if found any
            })
        }
    };

    const deleteItem = (val: Item) => {
        console.log(items.value);
        // axios.delete("http://127.0.0.1:8000/api/item/"+val.id)
        // .then(res => {
        //     console.log(res)
        //     console.log('Successfully deleted.')
        // })
        // .catch(error => {
        //     console.log(error)
        // });
      items.value = items.value.filter((item) => item.id !== val.id);
    };
</script>

<style scoped>
  .form {
    padding:1em 2em 0em 2em;
    width: 900px;
  }

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
</style>