<template>
    <DashboardNavbar/>
    <div id="layoutSidenav">
        <DashboardSidebar/>
        <div id="layoutSidenav_content">
            <main>
                <div class="container-xl px-4 mt-4">
                    <nav class="nav nav-borders">
                        <a class="nav-link active ms-0">Profile</a>
                    </nav>
                    <hr class="mt-0 mb-4" />
                    <form @submit.prevent="input" enctype="multipart/form-data">
                        <div class="row">
                            <div class="col-xl-4">
                                <div class="card mb-4 mb-xl-0">
                                    <div class="card-header">Profile Picture</div>
                                    <div>
                                        <input id="fileUpload" @change="onChange" type="file" accept=".jpg, .jpeg, .png" hidden>
                                    </div>
                                    <div class="card-body text-center">
                                        <img class="img-account-profile rounded-circle mb-2" :src="previewImage" alt="" />
                                        <div class="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                                        <button class="btn btn-primary" @click="click()" type="button">Upload new image</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-8">
                                <div class="card mb-4">
                                    <div class="card-header">Account Details</div>
                                    <div class="card-body">
                                        <div class="row gx-3 mb-3">
                                            <div class="col-md-6">
                                                <label class="small mb-1" for="inputFirstName">First name</label>
                                                <input class="form-control" id="inputFirstName" type="text" v-model="firstName" placeholder="Enter your first name"/>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="small mb-1" for="inputLastName">Last name</label>
                                                <input class="form-control" id="inputLastName" type="text" v-model="lastName" placeholder="Enter your last name"/>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputBirthday">Birthday</label>
                                            <input class="form-control" id="inputBirthday" type="date" v-model="birthday" placeholder="Enter your Birthday"/>
                                        </div>
                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputAddress">Address</label>
                                            <textarea class="form-control" id="inputAddress" cols="30" rows="10" v-model="address" placeholder="Enter your Address"></textarea>
                                        </div>
                                        <div class="mb-3" id="cv">
                                            <label class="small mb-1" for="inputCv">CV</label>
                                            <input class="form-control" id="inputCv" type="file" @change="onChangePdf" accept="application/pdf" placeholder="Enter your CV"/>
                                        </div>
                                        <button class="btn btn-primary" type="submit">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
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

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';

export default {
    data() {
        return{
            firstName: '',
            lastName: '',
            birthday: '',
            address: '',
            photo: '',
            pdf: '',
            previewImage: 'http://recruitment.test/images/default.png',
        }
    },
    mounted() {
        let userId = JSON.parse(localStorage.getItem('user'))
        let data = null

        axios.get('http://recruitment.test/api/profile/' + userId.id).then(res => {
            data = res.data.data

            if(data) {
                this.firstName = data.first_name
                this.lastName = data.last_name
                this.birthday = data.birthday
                this.address = data.address
                this.previewImage = 'http://recruitment.test/images/' + data.image

                document.getElementById('cv').setAttribute('hidden', 'hidden')

                data = data.id
            } else {
                return
            }
        })
    },
    props: ['id'],
    methods:{
        click() {
            document.getElementById("fileUpload").click()
        },
        onChange(e) {
            this.photo = e.target.files[0];
            this.previewImage = URL.createObjectURL(this.photo)
        },
        onChangePdf(e) {
            this.pdf = e.target.files[0];
        },
        input() {
            let userId = JSON.parse(localStorage.getItem('user'))
            let data = null

            axios.get('http://recruitment.test/api/profile/' + userId.id).then(res => {
                data = res.data.data

                if(data) {
                    Swal.fire(
                    'Warning',
                    'Anda sudah memasukkan data diri!',
                    'warning'
                    )
                    // axios.put('http://recruitment.test/api/profile/' + data, {
                    //     first_name: this.firstName,
                    //     last_name: this.lastName,
                    //     birthday: this.birthday,
                    //     address: this.address,
                    // }).then(() => {
                    //     Swal.fire(
                    //         'Success',
                    //         'Success!',
                    //         'success'
                    //     )
                    // }).catch(() => {
                    //     Swal.fire(
                    //         'Failed',
                    //         'Failed!',
                    //         'error'
                    //     )
                    // })
                } else {
                    let formData = new FormData()

                    formData.append('id', userId.id)
                    formData.append('firstName', this.firstName)
                    formData.append('lastName', this.lastName)
                    formData.append('birthday', this.birthday)
                    formData.append('address', this.address)
                    formData.append('photo', this.photo)
                    formData.append('cv', this.pdf)

                    axios.post('http://recruitment.test/api/profile', formData)
                        .then(() => {
                            Swal.fire(
                                'Success',
                                'Success!',
                                'success'
                            )
                            document.getElementById('cv').setAttribute('hidden', 'hidden')
                        }).catch(() => {
                            Swal.fire(
                                'Failed',
                                'Failed!',
                                'error'
                            )
                        });
                }
            })
        }
    },
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter }
}
</script>

<style>

</style>