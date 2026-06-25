import axios from "@/http/axios";

export const getAllUser = () => {
    return axios({
        url: '/api/user/getAllUser',
        method: 'GET',
    });
};

export const addUser = (data: { username: string; password: string; roleId?: number | null }) => {
    return axios({
        url: '/api/user/addUser',
        method: 'POST',
        data: data,
    });
};


export const updateUser = (id: number, data: { username: string; password: string ; roleId?: number | null }) => {
    return axios({
        url: `/api/user/updateUser/${id}`,
        method: 'PUT',
        data: data,
    });
};

export const deleteUser = (id: number) => {
    return axios({
        url: `/api/user/deleteUser/${id}`,
        method: 'DELETE',
    });
};

export const login = (data: { username: string; password: string }) => {
    return axios({
        url: '/api/user/login',
        method: 'POST',
        data: data
    });
};
