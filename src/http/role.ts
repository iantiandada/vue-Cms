import axios from "@/http/axios.ts";

export interface RoleAuthorizePayload {
    roleId: number
    permissionIds: number[]
}

export interface Role{
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


export const getRoleList = () => {
    return axios<Role[]>({
        url: '/api/role/roleList',
        method: 'GET',
    })
}

export const getAllPermission=()=>{
    return axios({
        url: '/api/role/getAllPermission',
        method: 'GET',
    })
}