<template>
    <div class="nav-fixed">
        <DashboardNavbar/>
        <div id="layoutSidenav">
            <DashboardSidebar/>
            <div id="layoutSidenav_content">
                <main>
                    <div class="container-xl px-4 mt-4">
                        <nav class="nav nav-borders">
                            <a class="nav-link active ms-0">Account</a>
                        </nav>
                        <hr class="mt-0 mb-4" />
                        <div class="row">
                            <div class="col-xl-4">
                                <form @submit.prevent="updatePassword">
                                    <div class="card mb-4">
                                        <div class="card-header">Password Management</div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="small mb-1" for="oldPassword">Old Password</label>
                                                <input class="form-control" id="oldPassword" type="password" v-model="oldPassword" placeholder="Enter your Old Password"/>
                                            </div>
                                            <div class="mb-3">
                                                <label class="small mb-1" for="newPassword">New Password</label>
                                                <input class="form-control" id="newPassword" type="password" v-model="newPassword" placeholder="Enter your New Password"/>
                                            </div>
                                            <div class="mb-3">
                                                <label class="small mb-1" for="confirmPassword">Confirm Password</label>
                                                <input class="form-control" id="confirmPassword" type="password" v-model="confirmPassword" placeholder="Enter your New Password again"/>
                                            </div>
                                            <button class="btn btn-primary float-end" type="submit">Update Password</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="col-xl-8">
                                <form @submit.prevent="updateAccount">
                                    <div class="card mb-4">
                                        <div class="card-header">Account Settings</div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="small mb-1" for="inputUsername">Username</label>
                                                <input class="form-control" id="inputUsername" type="text" v-model="username" placeholder="Enter your Username"/>
                                            </div>
                                            <div class="mb-3">
                                                <label class="small mb-1" for="inputEmail">Email</label>
                                                <input class="form-control" id="inputEmail" type="email" v-model="email" placeholder="Enter your Email"/>
                                            </div>
                                            <div class="mb-3">
                                                <label class="small mb-1" for="telephone">Phone Number</label>
                                                <MazPhoneNumberInput
                                                    v-model="phone"
                                                    fetch-country
                                                    show-code-on-list
                                                    color="info"
                                                    :preferred-countries="['ID', 'FR', 'BE', 'DE', 'US', 'GB']"
                                                    :ignored-countries="['AC']"
                                                />
                                            </div>
                                            <button class="btn btn-primary float-end" type="submit">Save changes</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
                <DashboardFooter/>
            </div>
        </div>
    </div>
</template>

<script>
import '@/load/login'
import 'maz-ui/css/main.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import router from '@/router'

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue'
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'

export default {
    data() {
        return{
            data: '',
            username: '',
            email: '',
            phone: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    },
    async created() {
        Swal.fire({
            title: 'Loading Data!',
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const response = await axios.get('get-token')
            this.data = response.data.data

            this.username = response.data.data.username
            this.email = response.data.data.email
            this.phone = response.data.data.phone_number

            Swal.close()
        } catch {
            Swal.close()
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Server error, silahkan muat ulang website!",
            })
        }
    },
    methods: {
        async updateAccount() {
            try {
                const response = await axios.put('user/' + this.data.id, {
                    name: this.username,
                    email: this.email,
                    phone_number: this.phone
                })

                Swal.fire({
                    icon: 'success',
                    title: response.data.status,
                    text: response.data.message,
                })

            } catch {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: "Server error, silahkan muat ulang website!",
                })
            }
        },
        async updatePassword() {
            if (this.newPassword == this.confirmPassword) {
                try {
                    const response =  await axios.put('update-password/' + this.data.id, {
                        oldPassword: this.oldPassword,
                        newPassword: this.newPassword
                    })
    
                    Swal.fire({
                        icon: "success",
                        title: response.data.status,
                        text: response.data.message,
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.setItem('reload', '1')
                            localStorage.removeItem('token')
                            router.push({
                                name: 'Login',
                            })
                        }
                    })

                } catch {
                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: "Server error, silahkan muat ulang website!",
                    })
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Password doesn't match",
                })
            }

        }
    },
    components: {
        DashboardNavbar,
        DashboardSidebar,
        DashboardFooter,
        MazPhoneNumberInput
    },
}
</script>

<style>

</style>