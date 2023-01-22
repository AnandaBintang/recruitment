import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.1.8:8000/api/'
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')