export type Role = "ADMIN" | "STUDENT" | "PROFESSOR" | "SECRETARY";
export const availableRoles: Role[] = [
  "STUDENT",
  "PROFESSOR",
  "SECRETARY",
  "ADMIN",
];

export type SidebarMenuType = {
  path: string;
  name: string;
  icon?: JSX.Element;
};

export type AppUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: number;
  lastModified?: number;
  lastModifiedBy?: string;
  role: Role;
  isEnabled: boolean;
};

export type TransformedUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastModified?: string;
  lastModifiedBy?: string;
  role: Role;
  isEnabled: boolean;
};

export type TransformedUserPage = {
  content: TransformedUser[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type AddExternalUserModalRef = {
  openDialog: () => void;
};

export type CreateThesisModalRef = {
  openDialog: () => void;
};

export type UserProfileModalRef = {
  openDialog: (username: string) => void;
};

export type ViewThesisModalRef = {
  openDialog: (id: string) => void;
};

export type IconProps = {
  className?: string;
};

export type CreateExternalUser = {
  username?: string;
  password?: string;
  verifyPassword?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
};

export type CreateExternalUserErrors = {
  username?: string;
  password?: string;
  email?: string;
};

export type CreateThesisErrors = {
  title?: string;
};

export type Course = {
  id: number;
  name: string;
  url: string;
};

export type BasicThesis = {
  id: string;
  title: string;
  createdAt: string;
  lastModified: string;
  professorFullName: string;
  status: string;
};

export type DetailedThesis = {
  id: string;
  title: string;
  description: string;
  professorFullName: string;
  reviewer1FullName: string,
  reviewer2FullName: string,
  status: string;
};
