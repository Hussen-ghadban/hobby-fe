import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoint";

import {
  AddChildTaskBundleFormData,
  UpdateChildTaskBundleFormData,
} from "@/types/childTaskBundle.types";

export const addChildTaskBundleService = async (
  data: AddChildTaskBundleFormData,
  token?: string
) => {
  return apiClient({
    method: "POST",
    endpoint: ENDPOINTS.ChildTaskBundle.add,
    data, 
    token,
  });
};

export const getAllChildTaskBundlesService = async (token?: string) => {
  return apiClient({
    method: "GET",
    endpoint: ENDPOINTS.ChildTaskBundle.getAll,
    token,
  });
};

export const getChildTaskBundleByIdService = async (
  id: string,
  token?: string
) => {
  return apiClient({
    method: "GET",
    endpoint: `${ENDPOINTS.ChildTaskBundle.getById}/${id}`,
    token,
  });
};

export const updateChildTaskBundleService = async (
  id: string,
  data: UpdateChildTaskBundleFormData,
  token?: string
) => {
  return apiClient({
    method: "PUT",
    endpoint: `${ENDPOINTS.ChildTaskBundle.update}/${id}`,
    data,
    token,
  });
};

export const deleteChildTaskBundleService = async (
  id: string,
  token?: string
) => {
  return apiClient({
    method: "DELETE",
    endpoint: `${ENDPOINTS.ChildTaskBundle.delete}/${id}`,
    token,
  });
};
