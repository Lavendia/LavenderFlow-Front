export interface WorkspaceModel {
  id: number;
  name: string;
  description?: string | null;
}

export interface WorkspaceMemberModel {
  id: number;
  workspaceId: number;
  userId: number;
  workspaceRoleId: number;
  userName?: string;
  userEmail?: string;
  roleName?: string;
}

export interface WorkspaceRoleModel {
  id: number;
  role?: string;
  name?: string;
}
