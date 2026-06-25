import axios from "@/http/axios.ts";

export interface newsData{
    newsTitle: string
    newsType: number
    newsContent:string
}

export  const saveNews=(data:newsData)=> {
    return axios({
        url: '/api/news/saveNews',
        method: 'POST',
        data
    })
}
export  const newsList=(start:number,rows:number)=>{
    return axios({
        url:'/api/news/newsList',
        method:'GET',
        params:{
            currentPage:start,
            rows
        }
    })
}
export const deleteNews = (id: number) => {
    return axios({
        url: `/api/news/deleteNews/${id}`,
        method: 'DELETE',
    });
};
export const auditNews = (id: number, status: string) => {
    return axios({
        url: `/api/news/audit/${id}`,
        method: 'PUT',
        data: { status }
    });
};