<template>
    <TheNavbar/>
    <header class="masthead" id="page-top">
        <div class="container px-4 px-lg-5 h-100">
            <div class="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
                <div class="col-lg-8 align-self-end">
                    <h1 class="text-white font-weight-bold">E-Recruitment</h1>
                    <hr class="divider" />
                </div>
                <div class="col-lg-8 align-self-baseline">
                    <p class="text-white-75 mb-5">Daftar Kerja atau Magang dengan Registrasi secara Online tanpa perlu ke Perusahaan atau Kantor</p>
                    <router-link v-if="data" class="btn btn-primary btn-xl" to="/dashboard">Masuk Dashboard</router-link>
                    <router-link v-else class="btn btn-primary btn-xl" to="/signup">Bergabung dengan Kami</router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import '@/load/home';

import router from '@/router'
import TheNavbar from '@/components/home/TheNavbar.vue';

export default {
    data: function () {
        return {
            data: JSON.parse(localStorage.getItem('user')),
        }
    },
    beforeUnmount() {
        let reload = true
        if(reload) {
            router.go()
        }
    },
    components: { TheNavbar }
}
</script>

<style>

</style>