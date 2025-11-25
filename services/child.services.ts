import { ENDPOINTS } from "@/api/endpoint";
import { apiClient } from "../api/base";
import type { AddChildFormData, UpdateChildFormData, Child, ChildResponse } from "@/types/child.types";

export const addChildService = async (child: AddChildFormData, token?: string): Promise<ChildResponse<Child>> => {
  console.log("API REQUEST:", { url: ENDPOINTS.Child.add, data: child });
  const response = await apiClient({
    method: "POST",
    endpoint: ENDPOINTS.Child.add, // Make sure this exists in your endpoints
    data: child,
    token,
  });
  console.log("API RESPONSE:", response);
  return response as ChildResponse<Child>;
};

export const getAllChildrenService = async (token?: string): Promise<ChildResponse<Child[]>> => {
  const response = await apiClient({
    method: "GET",
    endpoint: ENDPOINTS.Child.getAll,
    token,
  });
  return response as ChildResponse<Child[]>;
};

export const getChildByIdService = async (id: string, token?: string): Promise<ChildResponse<Child>> => {
  const response = await apiClient({
    method: "GET",
    endpoint: `${ENDPOINTS.Child.getById}/${id}`,
    token,
  });
  return response as ChildResponse<Child>;
};

export const updateChildService = async (id: string, data: UpdateChildFormData, token?: string): Promise<ChildResponse<Child>> => {
  const response = await apiClient({
    method: "PUT",
    endpoint: `${ENDPOINTS.Child.update}/${id}`,
    data,
    token,
  });
  return response as ChildResponse<Child>;
};

export const deleteChildService = async (id: string, token?: string): Promise<ChildResponse<null>> => {
  const response = await apiClient({
    method: "DELETE",
    endpoint: `${ENDPOINTS.Child.delete}/${id}`,
    token,
  });
  return response as ChildResponse<null>;
};
