import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'




import VueMultiselect from 'vue-multiselect';

import './assets/main.css'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'


/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { 
    faFloppyDisk,faRotate,faMagnifyingGlass,faTrash,
    faPenToSquare,faPlus
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faFloppyDisk)
library.add(faRotate)
library.add(faMagnifyingGlass)
library.add(faTrash)
library.add(faPenToSquare)
library.add(faPlus)

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

// import Datepicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('EasyDataTable', Vue3EasyDataTable);
app.component('VueMultiselect', VueMultiselect);
// app.component('Datepicker', Datepicker);
app.mount('#app')
