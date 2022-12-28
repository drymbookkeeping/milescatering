<template>
    <div class="mt-4">
        <b-button class="mr-1 save-reset-button" variant="primary"><font-awesome-icon icon="fa-solid fa-floppy-disk" @click="onSubmit" /> Save</b-button>
        <b-button class="save-reset-button" variant="primary"><font-awesome-icon icon="fa-solid fa-rotate" @click="onReset"/> Clear</b-button>
    </div>
    <hr>
</template>

<script>
export default {
    methods: {
        onReset() {
            console.log('reset')
        },
        onSubmit() {
            console.log('submitted')
        }
    },
}
</script>

<style scoped>
    .save-reset-button {
        width: 110px;
        font-size: 17px;
    }

    hr {
        background-color: #f1c40f;
    }
</style>