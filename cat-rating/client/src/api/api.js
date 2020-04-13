import axios from 'axios'

const api = axios.create({
    baseURL: '',
})

export const insertUser = payload => api.post(`/user`, payload)
export const getAllUsers = () => api.get(`/user`)
export const getUserById = (id) => api.get(`/user/${id}`)
export const deleteUserById = (id) => api.delete(`/user/${id}`)
export const updateUserById = (id, payload) => api.patch(`/user/${id}`, payload)

export const insertCat = (uid, payload) => api.post(`/cat/${uid}`, payload)
export const getAllCats = () => api.get(`/cat`)
export const getAllCatsByUid = (uid) => api.get(`/cat/${uid}`)
export const getCatByUidCid = (uid, cid) => api.get(`/cat/${uid}/${cid}`)
export const deleteCatByUidCid = (uid, cid) => api.delete(`/cat/${uid}/${cid}`)
export const updateCatByUidCid = (uid, cid, payload) => api.patch(`/cat/${uid}/${cid}`, payload)

const apis = {
    insertUser,
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    insertCat,
    getAllCats,
    getAllCatsByUid,
    getCatByUidCid,
    deleteCatByUidCid,
    updateCatByUidCid
}

export default apis