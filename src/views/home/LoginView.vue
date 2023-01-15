<template>
    <section class="page-section" id="contact">
        <div class="container px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-lg-8 col-xl-6 text-center">
                    <h2 class="mt-0">Login</h2>
                    <hr class="divider" />
                    <p class="text-muted mb-5">Siap untuk melamar kerja dengan kami? Login Sekarang!</p>
                </div>
            </div>
            <div class="row gx-4 gx-lg-5 justify-content-center mb-5">
                <div class="col-lg-6">
                    <form id="contactForm" @submit.prevent="login()">
                        <div class="form-floating mb-3">
                            <input class="form-control" id="username" type="email" placeholder="Masukkan Email" v-model="email" required/>
                            <label for="name">Email</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control" id="pass" type="password" placeholder="Masukkan Password" v-model="password" required/>
                            <label for="name">Password</label>
                        </div>
                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary btn-xl" id="submitButton">Login</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-lg-4 text-center mb-5 mb-lg-0">
                    <p>Belum Terdaftar? <router-link to="/signup">Signup</router-link></p>
                    <i class="bi-phone fs-2 mb-3 text-muted"></i>
                    <div>+62 8xx xxx xxx</div>
                    <div class="d-grid"><router-link to="/" class="btn btn-primary btn-sm mt-3">Kembali ke Beranda</router-link></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import '@/load/home'

    import axios from 'axios'
    import router from '@/router'
    import Swal from 'sweetalert2'

    export default {
        data() {
            return {
                email: '',
                password: ''
            }
        },
        async mounted() {
            if(localStorage.getItem('token')) {
                router.push({
                    name: 'Dashboard',
                })
            }
        },
        methods: {
            async login() {
                Swal.fire({
                    title: 'Please Wait!',
                    didOpen: () => {
                        Swal.showLoading()
                    },
                });
                try {
                    const response = await axios.post('login', {
                        email: this.email,
                        password: this.password
                    })

                    Swal.close()

                    Swal.fire({
                        icon: "success",
                        title: response.data.status,
                        text: response.data.msg,
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.setItem('reload', '1')
                            localStorage.setItem('token', response.data.content.access_token)

                            router.push({
                                name: 'Dashboard',
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
    }
</script>

<style scoped>
</style>