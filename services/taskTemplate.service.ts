import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoint";
import { AddTaskTemplateFormData, UpdateTaskTemplateFormData } from "@/types/taskTemplate.types";

export const addTaskTemplateService = async (data: AddTaskTemplateFormData, token?: string) => {
  return apiClient({ method: "POST", endpoint: ENDPOINTS.TaskTemplate.add, data, token });
};

export const getAllTaskTemplatesService = async (token?: string) => {
  return apiClient({ method: "GET", endpoint: ENDPOINTS.TaskTemplate.getAll, token });
};

export const getTaskTemplateByIdService = async (id: string, token?: string) => {
  return apiClient({ method: "GET", endpoint: `${ENDPOINTS.TaskTemplate.getById}/${id}`, token });
};

export const updateTaskTemplateService = async (id: string, data: UpdateTaskTemplateFormData, token?: string) => {
  return apiClient({ method: "PUT", endpoint: `${ENDPOINTS.TaskTemplate.update}/${id}`, data, token });
};

export const deleteTaskTemplateService = async (id: string, token?: string) => {
  return apiClient({ method: "DELETE", endpoint: `${ENDPOINTS.TaskTemplate.delete}/${id}`, token });
};
