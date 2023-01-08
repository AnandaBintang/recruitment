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
                                <form>
                                    <table class="table mb-0">
                                        <thead>
                                            <tr>
                                                <th class="border-gray-200" scope="col">#</th>
                                                <th class="border-gray-200" scope="col">Posisi</th>
                                                <th class="border-gray-200" scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(jobs, index) in job" :key="jobs.id">
                                                <td>{{ index + 1 }}</td>
                                                <td>{{ jobs.position }}</td>
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
</template>

<script>
import '@/load/login'

import axios from 'axios'
import Swal from 'sweetalert2'
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
        }
    },
    async created() {
        Swal.fire({
            title: 'Loading Data!',
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
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Server error, silahkan muat ulang website!",
            })
        }
        
        Swal.close()
    },
    methods: {
        async getVacancy() {
            try {
                const response = await axios.get('job')
                this.job = response.data.data
            } catch {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Server error, silahkan muat ulang website!",
                })
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
        apply(id){
            Swal.fire({
                title: 'Anda Yakin ingin Apply?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#22bb33',
                confirmButtonText: 'Yakin',
                cancelButtonColor: '#d33',
                reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        let checkData = null

                        axios.get('profile/' + this.data.id)
                        .then(res => {
                            checkData = res.data.data

                            if(checkData) {
                                try {
                                    axios.post('status', {
                                        user_id: this.data.id,
                                        job_id: id
                                    }).then(res => {
                                        Swal.fire({
                                            icon: "success",
                                            title: "Success!",
                                            text: res.data.message,
                                        })
                                    }).catch(res => {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Failed!",
                                            text: res.response.data.message,
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