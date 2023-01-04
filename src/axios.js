import axios from 'axios'

axios.defaults.baseURL = 'http://recruitment.test/api/'
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')