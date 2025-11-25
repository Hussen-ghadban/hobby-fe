import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoint";
import {
  AddTemplateChildFormData,
  UpdateTemplateChildFormData,
} from "@/types/templateChild.types";

export const addTemplateChildService = async (
  data: AddTemplateChildFormData,
  token?: string
) => {
  return apiClient({
    method: "POST",
    endpoint: ENDPOINTS.TemplateChild.add,
    data,
    token,
  });
};

export const getAllTemplateChildService = async (token?: string) => {
  return apiClient({
    method: "GET",
    endpoint: ENDPOINTS.TemplateChild.getAll,
    token,
  });
};

export const updateTemplateChildService = async (
  id: string,
  data: UpdateTemplateChildFormData,
  token?: string
) => {
  return apiClient({
    method: "PUT",
    endpoint: `${ENDPOINTS.TemplateChild.update}/${id}`,
    data,
    token,
  });
};

export const deleteTemplateChildService = async (
  id: string,
  token?: string
) => {
  return apiClient({
    method: "DELETE",
    endpoint: `${ENDPOINTS.TemplateChild.delete}/${id}`,
    token,
  });
};
