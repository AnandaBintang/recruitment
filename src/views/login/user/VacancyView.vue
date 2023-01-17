<template>
    <div class="nav-fixed">
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
                                    <form>
                                        <table class="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th class="border-gray-200" scope="col">#</th>
                                                    <th class="border-gray-200" scope="col">Posisi</th>
                                                    <th class="border-gray-200" scope="col">Kuota</th>
                                                    <th class="border-gray-200" scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(jobs, index) in job" :key="jobs.id">
                                                    <td>{{ index + 1 }}</td>
                                                    <td>{{ jobs.position }}</td>
                                                    <td>{{ jobs.quota }} Orang</td>
                                                    <td>
                                                        <button class="btn btn-warning btn-xs" type="submit" @click.prevent="openInfo(jobs.id)"><i class="fa fa-info"></i></button> |
                                                        <button class="btn btn-success btn-xs" @click.prevent="apply(jobs.id)" type="submit"><i class="fa fa-check"></i></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <div class="modal fade" id="vacancyInfo" tabindex="-1" aria-labelledby="vacancyInfo" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="vacancyInfo">Informasi Lowongan Pekerjaan</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h5>Minimum Requirement</h5>
                            <ul>
                                <li v-for="details in detail" :key="details.id">
                                    {{ details.detail }}
                                </li>
                            </ul>
                            <br>
                            <h5>Minimum Nilai : {{ minValue }}</h5>
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
    </div>
</template>

<script>
import '@/load/login'

import axios from 'axios'
import Swal from 'sweetalert2'
import router from '@/router'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue'

export default {
    data() {
        return{
            job: [],
            detail:[],
            minValue:Number,
            data: '',
            value: Number
        }
    },
    async beforeRouteEnter() {
        if(!localStorage.getItem('token')) {
            return router.push({
                path: 'page-not-found'
            })
        } else {
            const response = await axios.get('get-token')
            let data = response.data.data

            if(data.level != 'user') {
                return router.push({
                    path: 'page-not-found'
                })
            }
        }
    },
    async created() {
        Swal.fire({
            title: 'Loading Data!',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
        })

        try {
            const response = await axios.get('get-token')
            this.data = response.data.data
            
            this.getVacancy()
        } catch {
            Swal.close()
            router.go()
        }
        
        Swal.close()
    },
    mounted() {
        if(localStorage.getItem('reload')) {
            location.reload()
            localStorage.removeItem('reload');
        }
    },
    methods: {
        async getVacancy() {
            try {
                const response = await axios.get('get-active')
                this.job = response.data.data
            } catch {
                router.go()
            }
        },
        async openInfo(id) {
            const info = await axios.get('info/' + id)
            const value = await axios.get('get-min-val/' + id)

            this.detail = info.data.data
            this.minValue = value.data.data

            const vacancyInfo = new Modal('#vacancyInfo', {})
            vacancyInfo.show()
        },
        apply(job_id){
            Swal.fire({
                title: 'Anda Yakin ingin Apply?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#22bb33',
                confirmButtonText: 'Yakin',
                cancelButtonColor: '#d33',
                reverseButtons: true,
                allowEscapeKey: false,
                allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        let checkData = null

                        axios.get('profile/' + this.data.id)
                        .then(res => {
                            checkData = res.data.data
                            if(checkData) {
                                try {
                                    axios.get(`check-quota/${job_id}`)
                                    .then(() => {
                                        axios.get(`check-app/${this.data.id}/${job_id}`)
                                        .then(res => {
                                            let appCount = parseInt(JSON.stringify(res.data).replace('{}', 0))

                                            if(appCount == 0) {
                                                Swal.fire({
                                                    icon: "warning",
                                                    title: "Peringatan!",
                                                    text: "Pendaftaran hampir berhasil, anda akan diarahkan menuju tes tulis. Mohon Persiapkan diri anda!",
                                                    allowOutsideClick: false,
                                                    showCancelButton: true,
                                                    allowEscapeKey: false,
                                                    cancelButtonColor: '#d33',
                                                    reverseButtons: true,
                                                }).then((result) => {
                                                    if(result.isConfirmed) {
                                                        localStorage.setItem('test', true)
                                                        
                                                        router.push({
                                                            name: 'Test',
                                                            params: {
                                                                id: this.data.id,
                                                                job: job_id
                                                            }
                                                        })
                                                    }
                                                })
                                            } else {
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Failed!",
                                                    text: "Anda sudah Apply di Lowongan Kerja ini!",
                                                })
                                            }
                                        })
                                    }).catch(() => {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Failed!",
                                            text: "Kuota Lowongan sudah penuh!",
                                        })
                                    })
                                } catch {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error!",
                                        text: "Server error, silahkan muat ulang website!",
                                    })
                                }
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: "Failed!",
                                    text: "Anda belum mengisi data diri, silahkan isi dahulu!",
                                })
                            }
                        })
                    }
            })
        }
    },
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter }
}
</script>

<style>

</style>