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
                                            <tr v-for="jobs in job" :key="jobs.id">
                                                <td v-text="jobs.id"></td>
                                                <td v-text="jobs.position"></td>
                                                <td>
                                                    <button class="btn btn-success btn-xs" @click.prevent="apply(jobs.id)" type="submit">Apply</button>
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
            <DashboardFooter/>
        </div>
    </div>
</template>

<script>
import '@/load/login'

import axios from 'axios'
import Swal from 'sweetalert2'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';

export default {
    data() {
        return{
            job: [],
            data: JSON.parse(localStorage.getItem('user')),
        }
    },
    created() {
        this.getVacancy();
    },
    methods: {
        getVacancy() {
            axios.get('http://recruitment.test/api/job')
            .then(res => {
                this.job = res.data.data
            }).catch(() => {
                return
            })
        },
        apply(id){
            Swal.fire({
                title: 'Anda Yakin ingin Apply?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yakin'
                }).then((result) => {
                if (result.isConfirmed) {
                    axios.post('http://recruitment.test/api/status', {
                        user_id: this.data.id,
                        job_id: id
                    }).then(res => {
                        Swal.fire(
                            'Success',
                            res.message,
                            'success'
                        )
                    }).catch(res => {
                        Swal.fire(
                            'Success',
                            res.message,
                            'success'
                        )
                    })
                }
            });
        }
    },
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter }
}
</script>

<style>

</style>