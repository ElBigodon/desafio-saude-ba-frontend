import type { Axios } from 'axios'

export const $axios: Axios = axios.create({
  baseURL: 'http://localhost:8000/api',
  responseType: 'json'
})
