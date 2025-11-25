import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoint";
import type {
AddTaskInstanceFormData,
UpdateTaskInstanceFormData,
TaskInstance,
ApiListResponse,
UpdateTaskInstanceStatusResponse,
} from "@/types/taskInstance.types";
import { TaskInstanceByChildrenResponse } from "@/types/taskInstanceByChildren.types";


export const addTaskInstanceService = async (
data: AddTaskInstanceFormData,
token?: string
) => {
return apiClient({ method: "POST", endpoint: ENDPOINTS.TaskInstance.add, data, token });
};


export const getAllTaskInstancesService = async (
token?: string
): Promise<ApiListResponse<TaskInstance[]>> => {
const res = await apiClient({ method: "GET", endpoint: ENDPOINTS.TaskInstance.getAll, token });
return res as ApiListResponse<TaskInstance[]>;
};


export const getTaskInstanceByIdService = async (
id: string,
token?: string
): Promise<ApiListResponse<TaskInstance>> => {
const res = await apiClient({ method: "GET", endpoint: `${ENDPOINTS.TaskInstance.getById}/${id}`, token });
return res as ApiListResponse<TaskInstance>;
};


export const updateTaskInstanceService = async (
id: string,
data: UpdateTaskInstanceFormData,
token?: string
) => {
return apiClient({ method: "PUT", endpoint: `${ENDPOINTS.TaskInstance.update}/${id}`, data, token });
};


export const deleteTaskInstanceService = async (
id: string,
token?: string
) => {
return apiClient({ method: "DELETE", endpoint: `${ENDPOINTS.TaskInstance.delete}/${id}`, token });
};


export const getTaskInstancesByChildrenService = async (
  token?: string
): Promise<TaskInstanceByChildrenResponse> => {
  const response = await apiClient({
    method: "GET",
    endpoint: ENDPOINTS.TaskInstance.byChildren,
    token,
  });
  return response as TaskInstanceByChildrenResponse;
};

export const updateTaskInstanceStatus=async(
  id:string,
  token?:string
):Promise<UpdateTaskInstanceStatusResponse>=>{
   const response = await apiClient({
    method:"PUT",
    endpoint:`${ENDPOINTS.TaskInstance.updateStatus}/${id}`,
    token
  }) 
  return response as UpdateTaskInstanceStatusResponse;
}