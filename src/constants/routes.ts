export const BASE_URL = "http://localhost:8080";
export const API_ROUTES = {
 
ADMIN:{
    LOGIN:"/api/admin/login",
    FETCH_USERS :"/api/admin/users",
    BLOCK_USERS:(id:string)=>`/api/admin/users/${id}/block`,
    UNBLOCK_USERS:(id:string)=>`/api/admin/users/${id}/unblock`,
    FETCH_LAWYERS:'/api/admin/lawyers',
    BLOCK_LAWYER: (id: string) => `/api/admin/lawyers/${id}/block`,
    UNBLOCK_LAWYER: (id: string) => `/api/admin/lawyers/${id}/unblock`,
      APPROVE_LAWYER: (id: string) => `/api/admin/lawyers/${id}/approve`,
      REJECT_LAWYER:(id:string) =>`/api/admin/lawyers/${id}/reject`,
      LOGOUT_ADMIN:'/api/admin/logout'

},

USER:{
  LOGOUT_USER :`/api/user/logout`
},

LAWYER:{
  LOGOUT_LAWYER:`/api/lawyer/logout`,
  SCHEDULE_CREATE:'/api/lawyer/schedule/create'
}


}

