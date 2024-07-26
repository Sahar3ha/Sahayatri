import axios from "axios";
const Api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data"
    }
})

const config = {
    headers: {
        'authorization': `Bearer ${localStorage.getItem('token')}`
    }
}



// create user api
export const createUserApi = (data) => Api.post('/api/users/register', data)
export const loginUserApi = (data) => Api.post('/api/users/login', data)
export const singleUserApi = (id) => Api.get(`/api/users/get_user/${id}`, config)
export const createFeedbackApi = (id, data) => Api.post(`/api/users/create_feedback/${id}`, data, config)
export const getFeedbackApi = (data) => Api.get('/api/admin/get_feedback', data)
export const getFavouriteApi = (id) => Api.get(`/api/users/get_favourite/${id}`, config)
export const deleteFavouriteApi = (id) => Api.delete(`/api/users/delete_favourite/${id}`, config)
export const forgotPasswordApi = (data) => Api.post('/api/users/forgotPassword', data)
export const resetPasswordApi = (data) => Api.put(`/api/users/resetPassword/${data.token}`, { password: data.password })
export const createFavourtieApi = (data) => Api.post('/api/users/create_favourite',{collectionName: 'Favourites',newValue: data},config ,data)
export const getNotification = (data) => Api.get('/api/admin/get_notification', data)
export const deleteNotification = () => Api.delete('/api/admin/delete_notification')
export const updateProfileApi = (data) => Api.put('/api/users/update_user', data, config)


// vehicle api
export const createVehicleApi = (data) => Api.post('/api/admin/add_vehicles', data)
export const getAllVehicleApi = (data) => Api.get('/api/admin/get_vehicles', data)
export const deleteVehicleApi = (id) => Api.delete(`/api/admin/delete_vehicle/${id}`, config)
export const getSingleVehicleApi = (id) => Api.get(`/api/admin/get_vehicle/${id}`)
export const getActivatedVehiclesApi = (data) => Api.get('/api/admin/getActivatedVehicles', data)
export const updateVehicleApi = (id, formData) => Api.put(`/api/admin/update_vehicle/${id}`, formData, config)
export const activationApi = (id) => Api.patch(`/api/admin/activation/${id}`)
export const deactivationApi = (id) => Api.patch(`/api/admin/deactivation/${id}`)
export const create_notification = (id) => Api.post(`api/admin/notification/${id}`)

