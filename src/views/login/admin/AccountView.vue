<template>
    <DashboardNavbar/>
    <div id="layoutSidenav">
        <DashboardSidebar/>
        <div id="layoutSidenav_content">
            <main>
                <div class="container-xl px-4 mt-4">
                    <nav class="nav nav-borders">
                        <a class="nav-link active">Lowongan</a>
                    </nav>
                    <hr class="mt-0 mb-4" />
                    <div class="card mb-4">
                        <div class="card-header">Lowongan Pekerjaan</div>
                        <a class="btn btn-primary" @click.prevent="openForm()">Add</a>
                        <div class="card-body p-0">
                            <div class="table-responsive table-billing-history">
                                <table class="table mb-0" id="tableApplicant">
                                    <thead>
                                        <tr>
                                            <th class="border-gray-200" scope="col">#</th>
                                            <th class="border-gray-200" scope="col">Username</th>
                                            <th class="border-gray-200" scope="col">Email</th>
                                            <th class="border-gray-200" scope="col">Status</th>
                                            <th class="border-gray-200" scope="col">Nomor Telepon</th>
                                            <th class="border-gray-200" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(users, index) in user" :key="users.id">
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ users.name }}</td>
                                            <td>{{ users.email }}</td>
                                            <td>{{ users.status }}</td>
                                            <td>{{ users.phone_number }}</td>
                                            <td>
                                                <button class="btn btn-danger btn-xs" @click.prevent="remove(users.id)" title="Delete User"><i class="fa fa-trash"></i></button> |
                                                <button class="btn btn-primary btn-xs" @click.prevent="edit(users.id)" title="Edit User"><i class="fa fa-pen"></i></button> |
                                                <button class="btn btn-warning btn-xs" title="See User Profile"><i class="fa fa-eye"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div class="modal fade" id="accountForm" data-bs-backdrop="static" tabindex="-1" aria-labelledby="accountForm" aria-hidden="true">
                <form @submit.prevent="input()">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="accountForm">Data User</h1>
                            <button type="button" class="btn-close" @click.prevent="render()" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                                <div class="mb-3">
                                    <label class="col-form-label">Username</label>
                                    <input type="text" class="form-control" v-model="username" required placeholder="Enter a Username">
                                </div>
                                <div class="mb-3">
                                    <label class="col-form-label">Email</label>
                                    <input type="email" class="form-control" v-model="email" required placeholder="Enter an Email">
                                </div>
                                <div class="mb-3">
                                    <label class="col-form-label">Nomor Telepon</label>
                                    <MazPhoneNumberInput
                                        v-model="phone"
                                        required
                                        fetch-country
                                        show-code-on-list
                                        color="info"
                                        :preferred-countries="['ID', 'FR', 'BE', 'DE', 'US', 'GB']"
                                        :ignored-countries="['AC']"
                                    />
                                </div>
                                <div v-if="!editForm">
                                    <div class="mb-3">
                                        <label class="col-form-label">Password</label>
                                        <input type="password" class="form-control" v-model="password" required placeholder="Enter a Password">
                                    </div>
                                    <div class="mb-3">
                                        <label class="col-form-label">Re - Enter Password</label>
                                        <input type="password" class="form-control" v-model="password_confirm" required placeholder="Re-Enter your Password">
                                    </div>
                                </div>
                                <div v-else>
                                    <button type="button" class="btn btn-danger-soft text-danger btn-sm mt-3 mb-2" @click.prevent="resetPassword(id)">Reset Password</button>
                                    <div class="small text-muted"><i class="fa-solid fa-triangle-exclamation"></i> The reset password will return it to "password"</div>
                                </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="closeModal" @click.prevent="render()">Close</button>
                            <button type="submit" class="btn btn-primary">Input</button>
                        </div>
                        </div>
                    </div>
                </form>
            </div>
            <DashboardFooter/>
        </div>
    </div>
</template>

<script>
import '@/load/login'
import 'maz-ui/css/main.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'
// import { DataTable } from "simple-datatables"

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'

export default {
    data() {
        return{
            editForm: false,
            user: [],
            id: null,
            level: '',
            username: '',
            email: '',
            phone: '',
            password: '',
            password_confirm: '',
        }
    },
    async beforeRouteUpdate(to) {
        this.level = to.params.level

        Swal.fire({
            title: 'Loading Data!',
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try{
            const response = await axios.get('get-level/' + this.level)

            this.user = response.data.data
            
            Swal.close()
        } catch(e) {
            Swal.close()
        }
    },
    async created() {
        this.level = this.$route.params.level

        Swal.fire({
            title: 'Loading Data!',
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try{
            const response = await axios.get('get-level/' + this.level)

            this.user = response.data.data
            
            Swal.close()
        } catch(e) {
            Swal.close()
        }
    },
    // async mounted() {
    //     const response = await axios.get('get-level/' + this.level)

    //     let data = response.data.data

    //     let arr = []
    //     let btn = '<button class="btn btn-danger btn-xs" @click.prevent="remove(users.id)" title="Delete User"><i class="fa fa-trash"></i></button> | ' +
    //                 '<button class="btn btn-primary btn-xs" title="Edit User"><i class="fa fa-pen"></i></button> | ' +
    //                 '<button class="btn btn-warning btn-xs" title="See User Profile"><i class="fa fa-eye"></i></button>'

    //     for (var i = 0; i < data.length; i++) {
    //         arr.push(btn);        
    //     }

    //     let col = {
    //         "heading": "Actions",
    //         "data": arr
    //     }

    //     let obj = {
    //         "headings": [
    //             "#",
    //             "Username",
    //             "Email",
    //             "Status",
    //             "Nomor Telepon",
    //         ],
    //         "data": data.map(item => Object.values(item)),
    //     };

    //     const dataTable = new DataTable('#tableApplicant', {
    //         data: obj,
    //     })
        
    //     dataTable.columns.add(col)
    //     dataTable.init()
    // },
    methods: {
        async openForm() {
            const accountForm = new Modal('#accountForm', {
                keyboard: false
            })
            accountForm.show()
        },
        async input() {
            if(!this.editForm){
                if (this.password == this.password_confirm) {
                    try {
                        const response = await axios.post('user', {
                            name: this.username,
                            email: this.email,
                            level: this.level,
                            phone_number: this.phone,
                            password: this.password_confirm,
                        })
        
                        Swal.fire({
                            icon: 'success',
                            title: response.data.status,
                            text: response.data.message,
                        })

                        document.getElementById('closeModal').click()

                        this.render()
                    } catch (e) {
                        Swal.fire({
                            icon: 'error',
                            title: e.response.data.status,
                            text: e.response.data.message,
                        })
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Password doesn't match",
                    })
                }
            } else {
                try {
                    const response = await axios.put(`user/${this.id}`, {
                        name: this.username,
                        email: this.email,
                        phone_number: this.phone
                    })

                    Swal.fire({
                        icon: 'success',
                        title: response.data.status,
                        text: response.data.message,
                    })

                    document.getElementById('closeModal').click()

                    this.render()
                } catch(e) {
                    Swal.fire({
                        icon: 'error',
                        title: e.response.data.status,
                        text: e.response.data.message,
                    })
                }
            }
        },
        async edit(id){
            this.id = id
            this.editForm = true

            const res = await axios.get('user/' + id)

            this.username = res.data.data.name
            this.email = res.data.data.email
            this.phone = res.data.data.phone_number

            this.openForm()
        },
        async resetPassword(id){
            Swal.fire({
                title: 'Anda Yakin ingin Mereset Password User?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#22bb33',
                confirmButtonText: 'Yakin',
                confirmButtonColor: '#d33',
                reverseButtons: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.put(`reset-password/${id}`)
                        .then(response => {
                            Swal.fire({
                                icon: 'success',
                                title: response.data.status,
                                text: response.data.message,
                            })
                        }).catch(e => {
                            Swal.fire({
                                icon: 'error',
                                title: e.response.data.status,
                                text: e.response.data.message,
                            })
                        })
                    }
            })
        },
        async remove(id){
            Swal.fire({
                title: 'Anda Yakin ingin Menghapus User?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#22bb33',
                confirmButtonText: 'Yakin',
                confirmButtonColor: '#d33',
                reverseButtons: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.delete('user/' + id)
                        .then(res => {
                            Swal.fire({
                                icon: "success",
                                title: "Success!",
                                text: res.data.message,
                            })

                            this.render()
                        }).catch(res => {
                            Swal.fire({
                                icon: "error",
                                title: "Failed!",
                                text: res.data.message,
                            })
                        })
                    }
            })
        },
        async render() {
            const render = await axios.get('get-level/' + this.level)

            this.user = render.data.data
            this.editForm = false
            this.id = null
            this.username = ''
            this.email = ''
            this.phone = ''
            this.password = ''
            this.password_confirm = ''
        }
    },
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter, MazPhoneNumberInput }
}
</script>

<style>
</style>