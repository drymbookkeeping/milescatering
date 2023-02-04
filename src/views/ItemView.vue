<template>
    <main class="maincontainer container-fluid">
        <Navbar />

        <b-container fluid class="bmenucontainer p-0">
            <b-row>
                <b-col cols ="4" sm="4" md="3" lg="2">
                    <Sidebar/>
                </b-col>

                <b-col class="p-0" cols ="8" sm="8" md="9" lg="10">

                    <div class="mt-4">
                        <b-button class="mr-1 toolbar-button" variant="primary" @click="save"><font-awesome-icon icon="fa-solid fa-floppy-disk" /> Save</b-button>
                        <b-button class="toolbar-button" variant="primary" @click="resetForm"><font-awesome-icon icon="fa-solid fa-rotate" /> Clear</b-button>
                    </div>
                    <hr>
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
                                <!-- <b-button @click="deleteItem(item)" class="operation mr-1" variant="outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></b-button> -->
                                <b-button @click="toggle(item)" class="operation mr-1" variant="outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></b-button>
                                <b-button @click="retrieveInfo(item)" class="operation" variant="outline-info"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></b-button>
                            </div>
                        </template>
                        </EasyDataTable>
                        
                    </div>
                </b-col>
                
                
            </b-row>
        </b-container>

        
      
        <b-modal v-model="modalShow" no-close-on-backdrop="true">
            <template #header>
                <h5>Are you sure to delete this item?</h5>
            </template>

            <template #default>
                <p>Code: {{ this.selectedItem.itemCode }}</p>
                <p>Name: {{ this.selectedItem.itemName }}</p>
            </template>

            <template #footer>
                <button class="btn btn-primary" @click="deleteItem">Yes</button>
                <button class="btn btn-primary" @click="this.modalShow=false">Cancel</button>
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
    let selectedItem: Item[] = [];
    let alertMessage: String ="";

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
                show: true,
                modalShow: false,
                alertModal: false,
                selectedItem,
                alertMessage,
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
            onReset(event) {
                // event.preventDefault()
                // this.form = {
                //     itemName: null,
                //     itemCode: null
                // };
                // this.$nextTick(() => {
                //     this.$refs.observer.reset();
                // });
                console.log('reset')
            },
            onSubmit(event) {
                // event.preventDefault()
                console.log(this.form)

                axios.post("http://127.0.0.1:8000/api/item/",this.form)
                .then(res => {
                    console.log(res)
                    console.log('Successfully save.')
                })
                .catch(error => {
                    console.log(error)
                });
            }
            ,resetForm() {
                this.form = {
                    itemName: '',
                    itemCode: ''
                };
                this.refreshDatatable()
            },
            save() {
                if(this.form.id > 0) {
                    axios.put("http://127.0.0.1:8000/api/item/"+this.form.id,this.form)
                    .then(res => {
                        if(res) {
                            this.alertMessage = true;
                            this.toggleAlert('Successfully updated.');
                            this.resetForm()
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    });
                    
                } else {
                    axios.post("http://127.0.0.1:8000/api/item",this.form)
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
                    
                }
                
            },
            deleteItem(){
                axios.delete("http://127.0.0.1:8000/api/item/"+this.selectedItem.id)
                .then(res => {
                    this.toggleAlert('Successfully deleted.')
                })
                .catch(error => {
                    console.log(error)
                });
                this.items = this.items.filter((item) => item.id !== this.selectedItem.id);
                this.modalShow =false;
            },
            toggle(item: Item){
                this.selectedItem = item
                this.modalShow = !this.modalShow;
            }
            ,toggleAlert(message: String){
                this.alertMessage = message
                this.alertModal = !this.alertModal;
            }
            ,refreshDatatable(){
                axios.get("http://127.0.0.1:8000/api/item")
                .then(res => {
                    this.items = res.data;
                })
                .catch(error => {
                    console.log(error)
                })
            }
            ,retrieveInfo(item: Item) {
                console.log(item)
                this.form = item;
            }
        },
        components: { TopToolbar }
        ,mounted() {
            this.refreshDatatable()
        },
        compatConfig: { MODE: 3 }
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

    .toolbar-button {
        width: 110px;
        font-size: 17px;
    }

    hr {
        background-color: #f1c40f;
    }
</style>