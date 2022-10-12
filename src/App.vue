<template>
    <TheNavbar v-if="['Home'].indexOf($route.name) > -1"/>
    <router-view/>
    <TheFooter v-if="['Home'].indexOf($route.name) > -1"/>
</template>

<script>
import TheNavbar from "./components/TheNavbar.vue";
import TheFooter from "./components/TheFooter.vue";

export default {
    components: { TheNavbar, TheFooter }
}
</script>

<style>

</style>