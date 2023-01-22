<template>
    <div class="nav-fixed">
        <DashboardNavbar/>
        <div id="layoutSidenav">
            <DashboardSidebar/>
            <div id="layoutSidenav_content">
                <main>
                    <div class="container-xl px-4 mt-4">
                        <nav class="nav nav-borders">
                            <a class="nav-link active">Data User</a>
                        </nav>
                        <hr class="mt-0 mb-4" />
                        <div class="card mb-4">
                            <div class="card-header">Data {{ level }}</div>
                            <div class="card-body p-0 mb-3">
                                <div class="row">
                                    <div class="col-lg-10 offset-lg-1">
                                        <div class="table-responsive table-billing-history mt-3">
                                            <DataTable
                                                class="table table-hover display" 
                                                :data="user"
                                                :columns="columns"
                                                :options="{responsive: true, select: 'single', autoWidth: false,dom: 'Bflrtip', buttons: buttons, }"
                                                ref="table"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Username</th>
                                                        <th>Email</th>
                                                        <th>Nomor Telepon</th>
                                                        <th>Status</th>
                                                        <th>Dibuat pada</th>
                                                        <th>Diperbarui pada</th>
                                                    </tr>
                                                </thead>
                                            </DataTable>
                                            <div class="mt-3 mb-3">
                                                <a class="btn btn-sm btn-primary" @click.prevent="openForm()"><i class="fa fa-plus"></i></a> |
                                                <button class="btn btn-sm btn-danger" @click.prevent="remove()" title="Delete User"><i class="fa fa-trash"></i></button> |
                                                <button class="btn btn-sm btn-warning" @click.prevent="edit()" title="Edit User"><i class="fa fa-pen"></i></button> | 
                                                <button class="btn btn-sm btn-secondary" @click.prevent="showProfile()" title="Info User"><i class="fa fa-info"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <input type="hidden" name="idUser" id="idUser" readonly>
                <div class="modal fade" id="accountForm" data-bs-backdrop="static" tabindex="-1" aria-labelledby="accountForm" aria-hidden="true">
                    <form @submit.prevent="input()">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5">Data User</h1>
                                <button type="button" class="btn-close" @click.prevent="render()" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                    <div class="mb-3">
                                        <label class="col-form-label">Username</label>
                                        <input type="text" class="form-control" v-model="this.form.username" required placeholder="Enter a Username">
                                    </div>
                                    <div class="mb-3">
                                        <label class="col-form-label">Email</label>
                                        <input type="email" class="form-control" v-model="this.form.email" required placeholder="Enter an Email">
                                    </div>
                                    <div class="mb-3">
                                        <label class="col-form-label">Nomor Telepon</label>
                                        <MazPhoneNumberInput
                                            v-model="this.form.phone"
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
                                            <input type="password" class="form-control" v-model="this.form.password" required placeholder="Enter a Password">
                                        </div>
                                        <div class="mb-3">
                                            <label class="col-form-label">Re - Enter Password</label>
                                            <input type="password" class="form-control" v-model="this.form.password_confirm" required placeholder="Re-Enter your Password">
                                        </div>
                                    </div>
                                    <div v-else>
                                        <button type="button" class="btn btn-danger-soft text-danger btn-sm mt-3 mb-2" @click.prevent="resetPassword(id)">Reset Password</button>
                                        <div class="small text-muted"><i class="fa-solid fa-triangle-exclamation"></i> The reset password will return it to "password"</div>
                                    </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="closeModal" @click.prevent="render()">Close</button>
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal fade" id="profileForm" data-bs-backdrop="static" tabindex="-1" aria-labelledby="profileForm" aria-hidden="true">
                    <form @submit.prevent="inputProfile()">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5">Data Diri User</h1>
                                <button type="button" class="btn-close" @click.prevent="render()" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                    <input id="fileUpload" @change="onChange" type="file" accept=".jpg, .jpeg, .png" hidden>
                                    <img class="img-account-profile rounded-circle mb-2" :src="profile.previewImage" alt="" />
                                    <div class="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                                    <button class="btn btn-primary" @click="click()" type="button">Upload new image</button>
                                    <hr>
                                    <div class="mb-3">
                                        <label class="col-form-label">Nama Lengkap</label>
                                        <input type="text" class="form-control" required placeholder="Enter a Full Name" v-model="profile.full_name">
                                    </div>
                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputBirthday">Birthday</label>
                                        <input class="form-control" id="inputBirthday" type="date" v-model="profile.birthday" placeholder="Enter your Birthday"/>
                                    </div>
                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputBirthday">Gender</label>
                                        <br>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="gender" id="laki" value="L" v-model="profile.gender">
                                            <label class="form-check-label" for="laki">Laki-Laki</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="gender" id="perempuan" value="P" v-model="profile.gender">
                                            <label class="form-check-label" for="perempuan">Perempuan</label>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputAddress">Address</label>
                                        <textarea class="form-control" id="inputAddress" cols="30" rows="10" placeholder="Enter your Address" v-model="profile.address"></textarea>
                                    </div>
                                    <div class="mb-3" v-if="!profile.cv">
                                        <label class="small mb-1" for="inputCv">CV</label>
                                        <input class="form-control" id="inputCv" type="file" @change="onChangePdf" accept="application/pdf" placeholder="Enter your CV"/>
                                    </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="closeProfileModal" @click.prevent="render()">Close</button>
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                            </div>
                        </div>
                    </form>
                </div>
                <DashboardFooter/>
            </div>
        </div>
    </div>
</template>

<script>
import '@/load/login'
import 'datatables.net-select'
import 'datatables.net-responsive-bs5'
import 'datatables.net-buttons/js/buttons.print'

import axios from 'axios'
import Swal from 'sweetalert2'
import router from '@/router'
import { ref } from 'vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'
import DataTable from "datatables.net-vue3"
import DataTableLib from "datatables.net-bs5"
import ButtonsHtml5 from "datatables.net-buttons/js/buttons.html5"
import pdfFonts from "pdfmake/build/vfs_fonts"
import pdfmake from "pdfmake"
import JsZip from "jszip"

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'

export default {
    data() {
        return{
            editForm: false,
            user: ref([]),
            id: null,
            level: '',
            photo: '',
            form: {
                username: '',
                email: '',
                phone: '',
                password: '',
                password_confirm: '',
            },
            profile: {
                full_name: '',
                gender: '',
                birthday: '',
                address: '',
                previewImage: 'http://192.168.1.8:8000/images/default.jpg',
                cv: '',
            },
            columns:[
                {data:null, render: function(data,type,row,meta)
                    {return `${meta.row+1}`}},
                {data:'username'},
                {data:'email'},
                {data:'phone_number'},
                {
                    data: null,
                    className: 'dt-center',
                    render: function(data) {
                        if(data.status == 'aktif') {
                            return '<button class="btn btn-sm btn-success"></button>'
                        } else {
                            return '<button class="btn btn-sm btn-danger"></button>'
                        }
                    }
                },
                {
                    data: null,
                    render: function(data) {
                        return data.created_at.replace('T', ' | ').replace('.000000Z', '')
                    }
                },
                {
                    data: null,
                    render: function(data) {
                        return data.updated_at.replace('T', ' | ').replace('.000000Z', '')
                    }
                },
                {data:'id', visible: false, searchable: false,},
            ],
            buttons: [
                {
                    title: `Data User`,
                    extend: 'pdf',
                    exportOptions: {
                        columns: [ 0, 1, 2, 3, 4 ]
                    },
                    text: '<i class="fas fa-solid fa-file-pdf"></i> PDF',
                    className: 'btn btn-sm btn-danger'
                },
                {
                    title: `Data User`,
                    extend: 'csv',
                    exportOptions: {
                        columns: [ 0, 1, 2, 3, 4 ]
                    },
                    text: '<i class="fas fa-solid fa-file-csv"></i> CSV',
                    className: 'btn btn-sm btn-success'
                },
                {
                    title: `Data User`,
                    extend: 'print',
                    exportOptions: {
                        columns: [ 0, 1, 2, 3, 4 ]
                    },
                    text: '<i class="fas fa-solid fa-print"></i> Print',
                    className: 'btn btn-sm btn-dark'
                },
                {
                    title: `Data User`,
                    extend: 'copy',
                    exportOptions: {
                        columns: [ 0, 1, 2, 3, 4 ]
                    },
                    text: '<i class="fas fa-solid fa-copy"></i> Copy',
                    className: 'btn btn-sm btn-warning'
                },
            ]
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

            if(data.level == 'user') {
                return router.push({
                    path: 'page-not-found'
                })
            }
        }
    },
    async beforeRouteUpdate(to) {
        this.level = to.params.level

        Swal.fire({
            title: 'Loading Data!',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try{
            const response = await axios.get('get-level/' + this.level)

            this.user = response.data.data
            
            Swal.close()
        } catch {
            Swal.close()
        }
    },
    async created() {
        this.level = this.$route.params.level

        Swal.fire({
            title: 'Loading Data!',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try{
            const response = await axios.get('get-level/' + this.level)

            this.user = response.data.data
            
            Swal.close()
        } catch {
            Swal.close()
        }
    },
    beforeMount() {
        window.JsZip = JsZip
        pdfmake.vfs = pdfFonts.pdfMake.vfs
        DataTable.use(DataTableLib)
        DataTable.use(pdfmake)
        DataTable.use(ButtonsHtml5)
    },
    methods: {
        click() {
            document.getElementById("fileUpload").click()
        },
        onChange(e) {
            this.photo = e.target.files[0];
            this.profile.previewImage = URL.createObjectURL(this.photo)
        },
        onChangePdf(e) {
            this.profile.cv = e.target.files[0];
        },
        openForm() {
            const accountForm = new Modal('#accountForm', {
                keyboard: false
            })
            accountForm.show()
        },
        openProfileForm() {
            const profileForm = new Modal('#profileForm', {
                keyboard: false
            })
            profileForm.show()
        },
        async input() {
            if(!this.editForm){
                if (this.form.password == this.form.password_confirm) {
                    try {
                        const response = await axios.post('user', {
                            name: this.form.username,
                            email: this.form.email,
                            level: this.level,
                            phone_number: this.form.phone,
                            password: this.form.password_confirm,
                        })
        
                        Swal.fire({
                            icon: 'success',
                            title: response.data.status,
                            text: response.data.message,
                        })

                        document.getElementById('closeModal').click()

                        this.render()
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
            } else {
                try {
                    const response = await axios.put(`user/${this.id}`, {
                        name: this.form.username,
                        email: this.form.email,
                        phone_number: this.form.phone
                    })

                    Swal.fire({
                        icon: 'success',
                        title: response.data.status,
                        text: response.data.message,
                    })

                    document.getElementById('closeModal').click()

                    this.render()
                } catch {
                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: "Server error, silahkan muat ulang website!",
                    })
                }
            }
        },
        async inputProfile() {
            Swal.fire({
                title: 'Please Wait!',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            })
            
            try {
                await axios.get('profile/' + this.id)

                let formData = new FormData()

                formData.append('id', this.id)
                formData.append('fullName', this.profile.full_name)
                formData.append('birthday', this.profile.birthday)
                formData.append('gender', this.profile.gender)
                formData.append('address', this.profile.address)

                if(this.photo) {
                    formData.append('photo', this.photo)
                }
                if(this.profile.cv) {
                    formData.append('cv', this.profile.cv)
                }

                try {
                    const update = await axios.post('update-profile' ,formData)

                    if(update) {
                        Swal.close()

                        Swal.fire({
                            icon: "success",
                            title: "Success!",
                            text: "Update Profil Sukses!",
                            allowEscapeKey: false,
                            allowOutsideClick: false
                        })
                    }
                } catch {
                    Swal.close()

                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: "Gagal menyimpan data, silahkan coba lagi!",
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                }
                
                document.getElementById('closeProfileModal').click()
                this.render()
            } catch {
                let formData = new FormData()

                formData.append('id', this.id)
                formData.append('fullName', this.profile.full_name)
                formData.append('birthday', this.profile.birthday)
                formData.append('gender', this.profile.gender)
                formData.append('address', this.profile.address)
                formData.append('photo', this.photo)
                formData.append('cv', this.profile.cv)

                try {
                    const inputData = await axios.post('profile', formData)
                    
                    if(inputData) {
                        Swal.close()
                        
                        Swal.fire({
                            icon: "success",
                            title: "Success!",
                            text: "Profil berhasil dibuat!",
                        })
                    }
                } catch {
                    Swal.close()

                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: "Gagal menyimpan data, silahkan coba lagi!",
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                }
                
                document.getElementById('closeProfileModal').click()
                this.render()
            }
        },
        async edit(){
            let dt = this.$refs.table.dt();
            let id = document.getElementById("idUser")

            dt.rows({ selected: true }).every(function () {
                id.value = this.data().id;
            })

            if(id.value) {
                this.id = parseInt(id.value)
                this.editForm = true

                const res = await axios.get(`user/${this.id}`)

                this.form.username = res.data.data.name
                this.form.email = res.data.data.email
                this.form.phone = res.data.data.phone_number

                this.openForm()
            }
        },
        async showProfile(){
            let dt = this.$refs.table.dt();
            let id = document.getElementById("idUser")

            dt.rows({ selected: true }).every(function () {
                id.value = this.data().id;
            })

            if(id.value) {
                this.id = parseInt(id.value)
                this.editForm = true

                try {
                    const res = await axios.get(`profile/${this.id}`)
    
                    this.profile.full_name = res.data.data.full_name
                    this.profile.gender = res.data.data.gender
                    this.profile.address = res.data.data.address
                    this.profile.previewImage = 'http://192.168.1.8:8000/images/' + res.data.data.image + '?version=1'
                    this.profile.cv = res.data.data.cv
                    
                    this.openProfileForm()
                } catch {
                    this.openProfileForm()
                }
            }
        },
        async resetPassword(id){
            Swal.fire({
                title: 'Anda Yakin ingin Mereset Password User?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#22bb33',
                confirmButtonText: 'Yakin',
                confirmButtonColor: '#d33',
                reverseButtons: false,
                allowEscapeKey: false,
                allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.put(`reset-password/${id}`)
                        .then(response => {
                            Swal.fire({
                                icon: 'success',
                                title: response.data.status,
                                text: response.data.message,
                            })
                        }).catch(() => {
                            Swal.fire({
                                icon: "error",
                                title: "Failed!",
                                text: "Server error, silahkan muat ulang website!",
                            })
                        })
                    }
            })
        },
        async remove(){
            let dt = this.$refs.table.dt();
            let id = document.getElementById("idUser")

            dt.rows({ selected: true }).every(function () {
                id.value = this.data().id;
            })
            
            if(id.value) {
                Swal.fire({
                    title: 'Anda Yakin ingin Menghapus User?',
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#22bb33',
                    confirmButtonText: 'Yakin',
                    confirmButtonColor: '#d33',
                    reverseButtons: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            let dt = this.$refs.table.dt();

                            dt.rows({ selected: true }).every(function () {
                                let selectedData = this.data();
                                axios.delete('user/' + selectedData.id)
                                .then(res => {
                                    Swal.fire({
                                        icon: "success",
                                        title: "Success!",
                                        text: res.data.message,
                                    })
                                }).catch(() => {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Failed!",
                                        text: "Server error, silahkan muat ulang website!",
                                    })
                                })
                            });

                            this.render()
                        } else {
                            this.render()
                        }
                })
            }
        },
        async render() {
            const render = await axios.get('get-level/' + this.level)

            let id = document.getElementById("idUser")
            id.value = null

            this.user = render.data.data
            this.editForm = false
            this.id = null

            this.form.username = ''
            this.form.email = ''
            this.form.phone = ''
            this.form.password = ''
            this.form.password_confirm = ''

            this.profile.full_name = ''
            this.profile.gender = ''
            this.profile.address = ''
            this.profile.previewImage = 'http://192.168.1.8:8000/images/default.jpg'
            this.profile.cv = ''

            this.photo = ''
        }
    },
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter, MazPhoneNumberInput, DataTable }
}
</script>

<style scoped>
@import 'maz-ui/css/main.css';
@import 'datatables.net-bs5';
</style>