export interface Child {
  id: string;
  name: string;
  color: string;
  parentId: string;
}

export interface AddChildFormData {
  name: string;
  color: string;
}

export interface UpdateChildFormData {
  name?: string;
  color?: string;
}

export interface ChildResponse<T> {
  message: string;
  data: T;
}
