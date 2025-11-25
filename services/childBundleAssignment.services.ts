import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoint";

import {
  AddChildBundleAssignmentFormData,
  UpdateChildBundleAssignmentFormData,
} from "@/types/childBundleAssignment.types";

export const addChildBundleAssignmentService = async (
  data: AddChildBundleAssignmentFormData,
  token?: string
) => {
  return apiClient({
    method: "POST",
    endpoint: ENDPOINTS.ChildBundleAssignment.add,
    data,
    token,
  });
};

export const getAllChildBundleAssignmentsService = async (
  token?: string
) => {
  return apiClient({
    method: "GET",
    endpoint: `${ENDPOINTS.ChildBundleAssignment.getAll}`,
    token,
  });
};


export const getChildBundleAssignmentService = async (
  id: string,
  token?: string
) => {
  return apiClient({
    method: "GET",
    endpoint: `${ENDPOINTS.ChildBundleAssignment.getById}/${id}`,
    token,
  });
};

export const updateChildBundleAssignmentService = async (
  id: string,
  data: UpdateChildBundleAssignmentFormData,
  token?: string
) => {
  return apiClient({
    method: "PUT",
    endpoint: `${ENDPOINTS.ChildBundleAssignment.update}/${id}`,
    data,
    token,
  });
};

export const deleteChildBundleAssignmentService = async (
  id: string,
  token?: string
) => {
  return apiClient({
    method: "DELETE",
    endpoint: `${ENDPOINTS.ChildBundleAssignment.delete}/${id}`,
    token,
  });
};
