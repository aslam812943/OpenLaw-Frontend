export const BASE_URL = "http://localhost:8080";
export const API_ROUTES = {

  ADMIN: {
    LOGIN: "/api/admin/login",
    FETCH_USERS: "/api/admin/users",
    BLOCK_USERS: (id: string) => `/api/admin/users/${id}/block`,
    UNBLOCK_USERS: (id: string) => `/api/admin/users/${id}/unblock`,
    FETCH_LAWYERS: '/api/admin/lawyers',
    BLOCK_LAWYER: (id: string) => `/api/admin/lawyers/${id}/block`,
    UNBLOCK_LAWYER: (id: string) => `/api/admin/lawyers/${id}/unblock`,
    APPROVE_LAWYER: (id: string) => `/api/admin/lawyers/${id}/approve`,
    REJECT_LAWYER: (id: string) => `/api/admin/lawyers/${id}/reject`,
    LOGOUT_ADMIN: '/api/admin/logout'

  },

  USER: {
    LOGOUT_USER: `/api/user/logout`,
    GETPROFILE: `/api/user/profile`,
    UPDATE_PROFILE_INFO: "/api/user/profile/update",
    CHANGE_PASSWORD: "/api/user/profile/password",
    GETALL_LAWYERS: '/api/user/lawyers',
    SINGLE_LAWYER: (id: string) => `/api/user/lawyers/${id}`,
    GETSLOTS: (id: string) => `/api/user/lawyers/slots/${id}`




  },

  PAYMENT: {
    PAYMENT: `/api/booking/create-checkout-session`,
    CONFIRM: `/api/booking/confirm`
  },

  LAWYER: {
    LOGOUT_LAWYER: `/api/lawyer/logout`,
    SCHEDULE_CREATE: '/api/lawyer/schedule/create',
    SCHEDULE_UPDATE: `/api/lawyer/schedule/update`,
    FETCH_SCHEDULT_RULE: `/api/lawyer/schedule`,
    DELETE_SCHEDULE_RULE: '/api/lawyer/schedule/delete',
    GETPROFILE: `/api/lawyer/profile`,
    UPDATE_PROFILE: `/api/lawyer/profile/update`,
    CHANGE_PASSWORD: "/api/lawyer/profile/password",
    APPOIMENTS: `/api/lawyer/appoiments`,
    APPOIMENTS_UPDATE_STATUS: (id: string) => `/api/lawyer/appoiments/${id}/status`

  }


}

