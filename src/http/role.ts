import axios from "@/http/axios.ts";

export interface RoleAuthorizePayload {
    roleId: number
    permissionIds: number[]
}

export interface Role {
    id: number
    name: string
}

export const authorizeRole = (data: RoleAuthorizePayload) => {
    return axios({
        url: '/api/role/authRole',
        method: 'POST',
        data
    })
}
export const getRoleList =()=> {
    return axios({
        url: '/api/role/roleList',
        method: 'GET',
    })
}
export const getAllPermission =()=> {
    return axios({
        url: '/api/role/getAllPermission',
        method: 'GET',
    })
}
export const getPermissionOfCurrentRole=(roleId:number)=>{
    return axios({
        url: '/api/role/getPermissionCurrentRole',
        method:'GET',
        params:{
            roleId:roleId
        }
    })
}
export const deleteRole = (id: number) => {
    return axios({
        url: `/api/role/deleteRole/${id}`,
        method: 'DELETE',
    });
};
export const addRole = (data: { roleName: string;}) => {
    return axios({
        url: '/api/role/addRole',
        method: 'POST',
        data: data,
    });
};