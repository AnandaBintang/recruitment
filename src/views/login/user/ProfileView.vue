<template>
    <div class="nav-fixed">
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
                                        <div class="card-header">Biodata</div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="small mb-1" for="inputFullName">Full name</label>
                                                <input class="form-control" id="inputFullName" type="text" v-model="fullName" placeholder="Enter your full name"/>
                                            </div>
                                            <div class="mb-3">
                                                <label class="small mb-1" for="inputBirthday">Birthday</label>
                                                <input class="form-control" id="inputBirthday" type="date" v-model="birthday" placeholder="Enter your Birthday"/>
                                            </div>
                                            <div class="mb-3">
                                                <label class="small mb-1" for="inputBirthday">Gender</label>
                                                <br>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="gender" id="laki" value="L" v-model="gender">
                                                    <label class="form-check-label" for="laki">Laki-Laki</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="gender" id="perempuan" value="P" v-model="gender">
                                                    <label class="form-check-label" for="perempuan">Perempuan</label>
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <label class="small mb-1" for="inputAddress">Address</label>
                                                <textarea class="form-control" id="inputAddress" cols="30" rows="10" v-model="address" placeholder="Enter your Address"></textarea>
                                            </div>
                                            <div class="mb-3" id="cv">
                                                <label class="small mb-1" for="inputCv">CV</label>
                                                <input class="form-control" id="inputCv" type="file" @change="onChangePdf" accept="application/pdf" placeholder="Enter your CV"/>
                                            </div>
                                            <button class="btn btn-primary float-end" type="submit">Save changes</button>
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
    </div>
</template>

<script>
import '@/load/login'

import axios from 'axios'
import Swal from 'sweetalert2'
import router from '@/router'

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';

export default {
    data() {
        return{
            data: '',
            fullName: '',
            birthday: '',
            gender: '',
            address: '',
            photo: '',
            pdf: '',
            previewImage: 'http://recruitment.test/images/default.jpg',
        }
    },
    async created() {
        Swal.fire({
            title: 'Loading Data!',
            didOpen: () => {
                Swal.showLoading();
            },
        });
        
        let checkData = null

        const response = await axios.get('get-token')
        this.data = response.data.data

        try {
            const profile = await axios.get('profile/' + this.data.id)
            checkData = profile.data.data

            if(checkData) {
                this.fullName = checkData.full_name
                this.birthday = checkData.birthday
                this.gender = checkData.gender
                this.address = checkData.address
                this.previewImage = 'http://recruitment.test/images/' + checkData.image + '?version=1'
            }

            Swal.close()
        } catch {
            Swal.close()
            router.go()
        }
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
        async input() {
            try {
                let checkData = null

                const profile = await axios.get('profile/' + this.data.id)

                checkData = profile.data.data

                if(checkData) {
                    let formData = new FormData()

                    formData.append('id', this.data.id)
                    formData.append('fullName', this.fullName)
                    formData.append('birthday', this.birthday)
                    formData.append('gender', this.gender)
                    formData.append('address', this.address)

                    if(this.photo) {
                        formData.append('photo', this.photo)
                    }
                    if(this.pdf) {
                        formData.append('cv', this.pdf)
                    }
                    
                    try {
                        const update = await axios.post('update-profile' ,formData)

                        if(update) {
                            Swal.fire({
                                icon: "success",
                                title: "Success!",
                                text: "Update Profil Sukses!",
                                allowEscapeKey: false,
                                allowOutsideClick: false
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    router.go()
                                }
                            })
                        }
                    } catch {
                        Swal.fire({
                            icon: "error",
                            title: "Failed!",
                            text: "Gagal menyimpan data, silahkan coba lagi!",
                            allowEscapeKey: false,
                            allowOutsideClick: false
                        }).then((result) => {
                            if(result.isConfirmed) {
                                router.go()
                            }
                        })
                    }
                } else {
                    let formData = new FormData()

                    formData.append('id', this.data.id)
                    formData.append('fullName', this.fullName)
                    formData.append('birthday', this.birthday)
                    formData.append('gender', this.gender)
                    formData.append('address', this.address)
                    formData.append('photo', this.photo)
                    formData.append('cv', this.pdf)

                    try {
                        const inputData = await axios.post('profile', formData)

                        if(inputData) {
                            Swal.fire({
                                icon: "success",
                                title: "Success!",
                                text: "Profil berhasil dibuat!",
                            })

                            // router.go()
                        }
                    } catch {
                        Swal.fire({
                            icon: "error",
                            title: "Error!",
                            text: "Gagal menyimpan data, silahkan coba lagi!",
                            allowEscapeKey: false,
                            allowOutsideClick: false
                        }).then((result) => {
                            if(result.isConfirmed) {
                                router.go()
                            }
                        })
                    }
                }
            } catch {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
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