import axios from 'axios'
import { backendBaseUrl } from '../config'

export const api = axios.create({
  baseURL: backendBaseUrl
})

api.interceptors.request.use((config) => {
  return config
})

api.interceptors.response.use((response) => {
  return response
})
