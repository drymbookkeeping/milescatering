<template>
    <div class="navigation">
        <div class="navigation-button-container">
            <router-link to="/quote" class="navigation-items"> QUOTATION </router-link>
            <router-link to="/order" class="navigation-items"> ORDER </router-link>
            <router-link to="/menu" class="navigation-items"> MENU </router-link>
            <router-link to="/ingredient" class="navigation-items"> INGREDIENT </router-link>
            <router-link to="/item" class="navigation-items"> ITEMS </router-link>
        </div>
    </div>
    
    <router-view></router-view>
</template>

<style scoped>
 
    .navigation {
        border: 1px solid black;
        padding: 50px 20px;
        border-radius: 0px;
        box-shadow: 6px -4px 10px #192a56;
        height: 100vh;
        /* width: 260px; */
    }

    .navigation-items {
        font-size: 1.2em;
        font-weight: 600;
        height: 55px;
        border: 3px solid #353b48;
        border-radius: 18px 18px;
        margin-bottom: 25px;
        background-color: white;
        box-shadow: -15px 11px 5px #596275;
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        color:inherit;
    }

    .navigation-button-container {
        display: grid;
    }
    
</style>