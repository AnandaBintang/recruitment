<template>
    <section class="page-section" id="contact">
        <div class="container px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-lg-8 col-xl-6 text-center">
                    <h2 class="mt-0">Signup</h2>
                    <hr class="divider" />
                    <p class="text-muted mb-5">Daftar untuk menjadi bagian dari kami!</p>
                </div>
            </div>
            <div class="row gx-4 gx-lg-5 justify-content-center mb-5">
                <div class="col-lg-6">
                    <form id="contactForm" @submit.prevent="store">
                        <div class="form-floating mb-3">
                            <input class="form-control" id="name" type="text" placeholder="Masukkan Username atau Email" v-model="state.user"/>
                            <span v-if="v$.user.$error"> {{ v$.user.$errors[0].$message }} </span>
                            <label for="name">Username</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control" id="email" type="email" placeholder="name@example.com" v-model="state.email"/>
                            <span v-if="v$.email.$error"> {{ v$.email.$errors[0].$message }} </span>
                            <label for="email">Email address</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control" id="phone" type="number" pattern="(?=.*[0-9]).{10,}" placeholder="08123456789" v-model="state.phone"/>
                            <span v-if="v$.phone.$error"> {{ v$.phone.$errors[0].$message }} </span>
                            <label for="phone">Phone number</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control" id="pass" type="password" placeholder="Masukkan Password" v-model="state.password"/>
                            <span v-if="v$.password.$error"> {{ v$.password.$errors[0].$message }} </span>
                            <label for="name">Password</label>
                        </div>
                        <div class="d-grid"><button type="submit" class="btn btn-primary btn-xl" id="submitButton">Daftar</button></div>
                    </form>
                </div>
            </div>
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-lg-4 text-center mb-5 mb-lg-0">
                    <p>Sudah Terdaftar? <router-link to="/login">Login</router-link></p>
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
    
    import { reactive, computed } from 'vue'
    import useValidate from '@vuelidate/core'
    import { required, email, minLength } from '@vuelidate/validators'
    import { useRouter } from 'vue-router'
    import axios from 'axios'
    import Swal from 'sweetalert2'

    
    export default {
        setup() {
            const router = useRouter()

            const state = reactive({
                user: '',
                email: '',
                phone: '',
                password: '',
            })
            const rules = computed(() => {
                return {
                    user: { required },
                    email: { required, email },
                    phone: { required },
                    password: { required , minLength: minLength(6)},
                }
            })

            function store() {
                let user = state.user
                let email = state.email
                let phone = state.phone
                let password = state.password

                axios.post('http://recruitment.test/api/user', {
                    name: user,
                    email: email,
                    phone_number: phone,
                    password: password
                }).then(() => {
                    state.user = '',
                    state.email= '',
                    state.phone= '',
                    state.password= '',

                    router.push({
                        name: 'Login',
                    })

                    Swal.fire(
                        'Success',
                        'Anda sudah terdaftar!',
                        'success'
                    )
                }).catch(error => {
                    Swal.fire(
                        'Failed',
                        error,
                        'error'
                    )
                })
            }

            const v$ = useValidate(rules, state)
            return { state, v$, store }
        },
        methods: {
            submitForm() {
                this.v$.$validate()
                if (!this.v$.$error) {
                    alert('Form successfully submitted.')
                } else {
                    return
                }
            },
        },
        validations() {
            return {
                user: { required },
                password: { required },
            }
        },
    }
</script>

<style>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }
</style>