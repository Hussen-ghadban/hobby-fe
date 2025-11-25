export const ENDPOINTS = {
    Auth: {
        register: "/auth/register",
        login: "/auth/login",
        refreshToken: "/auth/refresh-token",
    },
    Child:{
        add: "/child/add",
        getAll: "/child/get",
        getById: "/child/get",
        update: "/child/update",
        delete: "/child/delete",
    },
     TaskTemplate: {
    add: "/taskTemplate/add",
    getAll: "/taskTemplate/get",
    getById: "/taskTemplate/get",
    update: "/taskTemplate/update",
    delete: "/taskTemplate/delete",
  },
  RecurrenceDay: {
  add: "/recurrenceDay/add",
  getAll: "/recurrenceDay/get",
  update: "/recurrenceDay/update",
  delete: "/recurrenceDay/delete",
},
TemplateChild: {
  add: "/templateChild/add",
  getAll: "/templateChild/get",
  getById: "/templateChild/get",
  update: "/templateChild/update",
  delete: "/templateChild/delete", 
},
TaskInstance: {
    add: "/taskInstance/add",
    getAll: "/taskInstance/get",
    getById: "/taskInstance/get",
    update: "/taskInstance/update",
    delete: "/taskInstance/delete",
    byChildren: "/taskInstance/by-children",
    updateStatus:"/taskInstance/update-status"
},
};