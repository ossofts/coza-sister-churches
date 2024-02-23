export type CreateUserInputs = {
  firstName: string;
  lastName: string;
  email: string;
  campusId?: string;
  departmentId?: string;
  roleId?: string;
  registeredBy?: string;
  isRegistered?: boolean;
};
export type CreateUserSchemaType = {
  firstName: string;
  lastName: string;
  email: string;
  departmentId?: string;
  roleId?: string;
};

export type CreateDepartmentPayload = {
  name: string;
  campusId: string;
  description: string;
};
