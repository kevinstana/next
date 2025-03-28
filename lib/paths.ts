export const appPathsMap: Record<string, string> = {
  users: "Users",
  "external-users": "External Users",
  "hua-users": "Hua Users",
  theses: "Theses",
  "my-theses": "My Theses",
  "my-assignment": "My Assignment",
  "assigned-reviews": "Assigned Reviews",
  actions: "Actions",
  published: "Published",
};

const adminPaths = new RegExp("^/(users|external-users|hua-users)(?:/.*)?$");
const professorPaths = new RegExp("^/(my-theses|assigned-reviews)(?:/.*)?$");
const studentPaths = new RegExp("^/(my-assignment)(?:/.*)?$");
const secretaryPaths = new RegExp("^/(actions)(?:/.*)?$");

export function isAdminPath(pathname: string): boolean {
  return adminPaths.test(pathname);
}

export function isProfessorPath(pathname: string): boolean {
  return professorPaths.test(pathname);
}

export function isStudentPath(pathname: string): boolean {
  return studentPaths.test(pathname);
}

export function isSecretaryPath(pathname: string): boolean {
  return secretaryPaths.test(pathname);
}
