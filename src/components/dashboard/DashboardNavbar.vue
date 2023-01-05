<template>
    <nav class="topnav navbar navbar-expand shadow justify-content-between justify-content-sm-start navbar-light bg-white" id="sidenavAccordion">
        <button class="btn btn-icon btn-transparent-dark order-1 order-lg-0 me-2 ms-lg-2 me-lg-0" id="sidebarToggle"><VueFeather type="menu"></VueFeather></button>
        <router-link to="/dashboard" class="navbar-brand pe-3 ps-4 ps-lg-2">E-Recruitment</router-link>
        <ul class="navbar-nav align-items-center ms-auto">
            <li class="nav-item dropdown no-caret dropdown-user me-3 me-lg-4">
                <a class="btn btn-icon btn-transparent-dark dropdown-toggle" id="navbarDropdownUserImage" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img class="img-fluid" :src="previewImage" /></a>
                <div class="dropdown-menu dropdown-menu-end border-0 shadow animated--fade-in-up" aria-labelledby="navbarDropdownUserImage">
                    <h6 class="dropdown-header d-flex align-items-center">
                        <img class="dropdown-user-img" :src="previewImage" />
                        <div class="dropdown-user-details">
                            <div class="dropdown-user-details-name">{{ data.name }}</div>
                            <div class="dropdown-user-details-email">{{ data.email }}</div>
                        </div>
                    </h6>
                    <div class="dropdown-divider"></div>
                    <router-link to="/account-setting" class="dropdown-item">
                        <div class="dropdown-item-icon"><VueFeather type="settings"></VueFeather></div>
                        Account
                    </router-link>
                    <a class="dropdown-item" href="#" @click.prevent="logout">
                        <div class="dropdown-item-icon"><VueFeather type="log-out"></VueFeather></div>
                        Logout
                    </a>
                </div>
            </li>
        </ul>
    </nav>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import Swal from 'sweetalert2'
import VueFeather from 'vue-feather';

export default {
    data: function() {
        return {
            data: '',
            previewImage: 'http://recruitment.test/images/default.jpg',
        }
    },
    async created() {
        let checkData = null

        const response = await axios.get('get-token')
        this.data = response.data.data

        try {
            const profile = await axios.get('profile/' + this.data.id);
            checkData = profile.data.data

            if(checkData) {
                this.previewImage = 'http://recruitment.test/images/' + checkData.image
            } else {
                return
            }
        } catch {
            return
        }
    },
    methods: {
        logout() {
            Swal.fire({
                    title: 'Anda yakin ingin logout?',
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#3085d6',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Logout'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let token = localStorage.getItem('token')
                        axios.post('auth/logout', {}, {
                            headers: {
                                'Authorization': `Bearer ${token}` 
                            }
                        }).then(() => {
                            Swal.fire({
                            icon: "success",
                            title: "Logout!",
                            text: "Kamu berhasil logout!",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    localStorage.setItem('reload', '1')
                                    localStorage.removeItem('token')
                                    router.push({
                                        name: 'Home',
                                    })
                                }
                            })
                        })
                    }
            });
        }
    },
    components: {
        VueFeather
    },
}
</script>

<style>

</style>