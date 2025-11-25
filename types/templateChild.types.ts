export interface TemplateChild {
  id: string;
  templateId: string;
  childId: string;
  assignedDate?: string | null;

  template?: {
    id: string;
    name: string;
  };

  child?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface AddTemplateChildFormData {
  templateId: string;
  childId: string;
}

export interface UpdateTemplateChildFormData {
  templateId?: string;
  childId?: string;
}
