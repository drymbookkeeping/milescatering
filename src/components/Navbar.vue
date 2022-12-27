<template>
    <b-navbar class="bgcolor" toggleable="lg" type="light" fixed="top" sticky="true">
        <b-navbar-brand href="#">
            <img src="./../assets/logo.png" class="logo d-inline-block align-top" alt="logo">
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
           
            <!-- <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form> -->
           <div class="userName"> WELCOME, KENT SILAO</div>
            <b-nav-item-dropdown right>
                
                <!-- Using 'button-content' slot -->
                <template #button-content>
                    <img class="profile" src="./../assets/userProfile.svg" >
                </template>
                <b-dropdown-item href="#">Profile</b-dropdown-item>
                <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
        </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>




<style scoped>
    .logo {
        width: 110px;
    }
    .ml-auto{
        margin-left: auto;
    }

    .bgcolor {
        background-color: #192a56;
        color: white;
        box-shadow: 1px 6px 5px #f1c40f;
    }

    .profile {
        width: 40px;
        margin-right: 5px;
    }

    .userName {
        vertical-align: middle;
        margin: auto;
        font-size: 20px;
        font-weight: 700;
    }

    
</style>