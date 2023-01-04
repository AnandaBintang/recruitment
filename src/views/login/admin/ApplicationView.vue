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
                        <div class="card-body p-0">
                            <div class="table-responsive table-billing-history">
                                <table class="table mb-0">
                                    <thead>
                                        <tr>
                                            <th class="border-gray-200" scope="col">#</th>
                                            <th class="border-gray-200" scope="col">Pelamar</th>
                                            <th class="border-gray-200" scope="col">Posisi</th>
                                            <th class="border-gray-200" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(app, index) in applicant" :key="app.id">
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ app.first_name + ' ' + app.last_name }}</td>
                                            <td>{{ app.position }}</td>
                                            <td>
                                                <button class="btn btn-danger btn-xs" type="submit" @click.prevent="reject(app.id)"><i class="fa fa-xmark"></i></button> |
                                                <button class="btn btn-warning btn-xs" type="submit" @click.prevent="openInfo(app.user_id)"><i class="fa fa-info"></i></button> |
                                                <button class="btn btn-success btn-xs" type="submit" @click.prevent="accept(app.id)"><i class="fa fa-check"></i></button>
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

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';

export default {
    data() {
        return{
            applicant: [],
            cv: null,
        }
    },
    async created() {
        Swal.fire({
            title: 'Loading Data!',
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try{
            const response = await axios.get('status')

            this.applicant = response.data.data
            

            Swal.close()
        } catch(e) {
            Swal.close()

        }
    },
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