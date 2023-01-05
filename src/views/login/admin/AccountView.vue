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
                        <router-link to="#" class="btn btn-primary">Add</router-link>
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
                                                <button class="btn btn-danger btn-xs" type="submit" title="Delete User"><i class="fa fa-trash"></i></button> |
                                                <button class="btn btn-primary btn-xs" type="submit" title="Edit User"><i class="fa fa-pen"></i></button> |
                                                <button class="btn btn-warning btn-xs" type="submit" title="See User Profile"><i class="fa fa-eye"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div class="modal fade" id="applicantInfo" tabindex="-1" aria-labelledby="vacancyInfo" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="vacancyInfo">Informasi Pelamar Kerja</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <a :href="cv">Download CV</a>
                        <hr>
                        <h5>Nilai Tes Tulis :</h5>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
            <DashboardFooter/>
        </div>
    </div>
</template>

<script>
import '@/load/login'

import axios from 'axios'
import Swal from 'sweetalert2'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'
// import { DataTable } from "simple-datatables"

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';

export default {
    data() {
        return{
            user: [],
            cv: null,
        }
    },
    async beforeRouteUpdate(to) {
        let level = to.params.level

        Swal.fire({
            title: 'Loading Data!',
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try{
            const response = await axios.get('get-level/' + level)

            this.user = response.data.data
            
            Swal.close()
        } catch(e) {
            Swal.close()
        }
    },
    async created() {
        let level = this.$route.params.level

        Swal.fire({
            title: 'Loading Data!',
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try{
            const response = await axios.get('get-level/' + level)

            this.user = response.data.data
            
            Swal.close()
        } catch(e) {
            Swal.close()
        }
    },
    // async mounted() {
        // const dataTable = new DataTable('#tableApplicant', {})
        // dataTable.init()
    // },
    methods: {
        async openInfo(id) {
            try {
                const response = await axios.get('profile/' + id)

                this.cv = 'http://recruitment.test/docs/' + response.data.data.cv

                const applicantInfo = new Modal('#applicantInfo', {})
                applicantInfo.show()
            } catch {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: "Server error, silahkan muat ulang website!",
                })
            }
        },
        async accept(id) {
            try {
                Swal.fire({
                title: 'Anda Yakin ingin menerima pelamar ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#22bb33',
                confirmButtonText: 'Yakin',
                cancelButtonColor: '#d33',
                reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post('accept-applicant', {id: id})
                        .then(res => {
                            Swal.fire({
                                icon: "success",
                                title: "Success!",
                                text: res.data.message,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    this.$router.go()
                                }
                            })
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
        },
        async reject(id) {
            try {
                Swal.fire({
                title: 'Anda Yakin ingin menolak pelamar ini?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#22bb33',
                confirmButtonText: 'Yakin',
                confirmButtonColor: '#d33',
                reverseButtons: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post('reject-applicant', {id: id})
                        .then(res => {
                            Swal.fire({
                                icon: "success",
                                title: "Success!",
                                text: res.data.message,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    this.$router.go()
                                }
                            })
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
        }
    },
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter }
}
</script>

<style>
</style>