<template>
    <nav class="topnav navbar navbar-expand shadow justify-content-between justify-content-sm-start navbar-light bg-white" id="sidenavAccordion">
        <button class="btn btn-icon btn-transparent-dark order-1 order-lg-0 me-2 ms-lg-2 me-lg-0" id="sidebarToggle"><i data-feather="menu"></i></button>
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
                    <!-- <a class="dropdown-item" href="#!">
                        <div class="dropdown-item-icon"><i data-feather="settings"></i></div>
                        Account
                    </a> -->
                    <a class="dropdown-item" href="#" @click.prevent="logout">
                        <div class="dropdown-item-icon"><i data-feather="log-out"></i></div>
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

export default {
    data: function() {
        return {
            previewImage: 'http://recruitment.test/images/default.png',
            data: JSON.parse(localStorage.getItem('user'))
        }
    },
    created() {
        let checkData = null

        axios.get('http://recruitment.test/api/profile/' + this.data.id).then(res => {
            checkData = res.data.data

            if(checkData) {
                this.previewImage = 'http://recruitment.test/images/' + checkData.image
            } else {
                return
            }
        })
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
                    axios.post('http://recruitment.test/api/auth/logout', {}, {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    }).then(() => {
                        localStorage.removeItem('user')
                        localStorage.removeItem('level')
                        localStorage.removeItem('token')

                        router.push({
                            name: 'Home',
                        })

                        Swal.fire(
                            'Logout!',
                            'Kamu Telah Logout.',
                            'success'
                        )
                    })
                }
            });
        }
    },
}
</script>

<style>

</style>