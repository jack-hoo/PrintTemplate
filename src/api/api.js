import axios from 'axios';

let base = 'http://10.1.133.170:9099';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
//
// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };
//
// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };
//
// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
//
// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };
//
// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };
//
// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const getSysItems = params => {
    return axios.get(`${base}/sys_items`, params).then(res => res.data);
}

export const getTypeNames = params => {
    return axios.get(`${base}/sys_items/typename`, params).then(res => res.data);
}

export const addSysItem = params => {
    return axios.post(`${base}/sys_items`, params).then(res => res.data);
}

export const updateSysItem = params => {
    return axios.put(`${base}/sys_items`, params).then(res => res.data);
}
export const deleteSysItem = id => {
    return axios.delete(`${base}/sys_items/` + id).then(res => res.data);
}

export const getAllStructs = params => {
    return axios.get(`${base}/structs`, params).then(res => res.data);
}
export const addStruct = params => {
    return axios.post(`${base}/structs`, params).then(res => res.data);
}

export const updateStruct = params => {
    return axios.put(`${base}/structs`, params).then(res => res.data);
}

export const deleteStruct = id => {
    return axios.delete(`${base}/structs/` + id).then(res => res.data);
}

export const getAllTempls = params => {
    return axios.get(`${base}/template`, params).then(res => res.data);
}

export const addTempl = params => {
    return axios.post(`${base}/template`, params).then(res => res.data);
}

export const delTempl = id => {
    return axios.delete(`${base}/template/`+ id).then(res => res.data)
}

export const updateTempl = params => {
    return axios.put(`${base}/template`, params).then(res => res.data);
}

export const addRowToTemp = params =>{
    return axios.post(`${base}/template/row`, params).then(res => res.data);
}