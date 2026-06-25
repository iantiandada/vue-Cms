import axios from "@/http/axios.ts";
import type { Permission } from "@/Permission.vue";

export const getAllPermission =()=> {
    return axios({
        url: '/api/permission/getAllPermission',
        method: 'GET',
    })
}
export const deletePermission = (id: number) => {
    return axios({
        url: `/api/permission/deletePermission/${id}`,
        method: 'DELETE',
    });
};
export const addPermission = (data: { name: string; menuType: string; parentId: number | null }) => {
    return axios({
        url: '/api/permission/addPermission',
        method: 'POST',
        data: data,
    });
};