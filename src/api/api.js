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