<template>
    <nav class="navbar navbar-expand-lg navbar-light fixed-top py-3" id="mainNav">
        <div class="container px-4 px-lg-5">
            <a class="navbar-brand" href="#page-top">E-Recruitment</a>
            <button class="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ms-auto my-2 my-lg-0">
                    <li v-if="data" class="nav-item text-white"><a  href="#" @click.prevent="logout" class="nav-link">{{ data }}</a></li>
                    <li v-else class="nav-item"><router-link to="/login" class="nav-link">Login</router-link></li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    data: function() {
        return {
            data: localStorage.getItem('user')
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
                    axios.post('http://recruitment.test/api/auth/logout', {}, {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    }).then(() => {
                        localStorage.removeItem('user')
                        localStorage.removeItem('token')

                        this.data = ''

                        Swal.fire(
                            'Logout!',
                            'Kamu Telah Logout.',
                            'success'
                        )
                    })
                }
            })
        },
    },
}
</script>

<style>

</style>