import { APIRelation } from "@/src/api_utils/APIRelationUtils";
import { APIRole } from "@/src/api_utils/APIRoleUtils";
import { APIUser } from "@/src/api_utils/APIUserUtils";
import { APIWorkspace } from "@/src/api_utils/APIWorkspaceUtils";
import type { WorkspaceMemberModel, WorkspaceModel, WorkspaceRoleModel } from "@/src/models/WorkspaceModels";

function readId(value: unknown): number | null {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
}

function normalizeWorkspace(raw: Record<string, unknown>): WorkspaceModel | null {
  const id = readId(raw.id ?? raw.Id);
  const name = String(raw.name ?? raw.Name ?? "").trim();

  if (id == null || !name) return null;

  return {
    id,
    name,
    description: (raw.description ?? raw.Description ?? null) as string | null,
  };
}

function normalizeMember(raw: Record<string, unknown>): WorkspaceMemberModel | null {
  const id = readId(raw.id ?? raw.Id);
  const workspaceId = readId(raw.workspaceId ?? raw.WorkspaceId ?? (raw.workspace as Record<string, unknown> | undefined)?.id);
  const userId = readId(raw.userId ?? raw.UserId ?? (raw.user as Record<string, unknown> | undefined)?.id);
  const workspaceRoleId = readId(
    raw.workspaceRoleId ?? raw.WorkspaceRoleId ?? raw.roleId ?? raw.RoleId,
  );

  if (id == null || workspaceId == null || userId == null || workspaceRoleId == null) {
    return null;
  }

  const user = (raw.user ?? raw.User) as Record<string, unknown> | undefined;
  const role = (raw.workspaceRole ?? raw.WorkspaceRole) as Record<string, unknown> | undefined;

  return {
    id,
    workspaceId,
    userId,
    workspaceRoleId,
    userName: String(
      raw.userName ?? raw.UserName ?? user?.name ?? user?.Name ?? "",
    ),
    userEmail: String(
      raw.userEmail ?? raw.UserEmail ?? user?.email ?? user?.Email ?? "",
    ),
    roleName: String(
      raw.roleName ?? raw.RoleName ?? role?.role ?? role?.name ?? role?.Role ?? role?.Name ?? "",
    ),
  };
}

export async function getCurrentUserId(): Promise<number> {
  const me = await APIUser.getMe();
  const userId = readId(me?.id ?? me?.Id);

  if (userId == null) {
    throw new Error("Could not resolve the logged-in user.");
  }

  return userId;
}

async function getWorkspaceRoles(): Promise<WorkspaceRoleModel[]> {
  const roles = await APIRole.workspace.getWorkspaceRoles();
  return Array.isArray(roles) ? (roles as WorkspaceRoleModel[]) : [];
}

export async function resolveWorkspaceRoleId(preferredNames: string[]): Promise<number> {
  const roles = await getWorkspaceRoles();

  for (const preferred of preferredNames) {
    const match = roles.find((role) => {
      const label = String(role.role ?? role.name ?? "").toLowerCase();
      return label === preferred.toLowerCase();
    });

    if (match) return Number(match.id);
  }

  if (roles[0]) return Number(roles[0].id);

  throw new Error("No workspace roles are configured on the server.");
}

export async function addUserToWorkspace(
  workspaceId: number,
  userId: number,
  roleNames: string[],
): Promise<void> {
  const workspaceRoleId = await resolveWorkspaceRoleId(roleNames);
  await APIRelation.workspaces.addUserToWorkspace(workspaceId, userId, workspaceRoleId);
}

export async function addCurrentUserAsWorkspaceOwner(workspaceId: number): Promise<void> {
  const userId = await getCurrentUserId();
  await addUserToWorkspace(workspaceId, userId, ["owner", "admin", "administrator"]);
}

export async function fetchWorkspaceMemberships(userId: number): Promise<WorkspaceMemberModel[]> {
  const raw = await APIRelation.workspaces.getWorkspaceUsersByUserId(String(userId));
  const list = Array.isArray(raw) ? raw : [];

  return list
    .map((item) => normalizeMember(item as Record<string, unknown>))
    .filter((item): item is WorkspaceMemberModel => item != null);
}

export async function fetchWorkspaceMembers(workspaceId: number): Promise<WorkspaceMemberModel[]> {
  const raw = await APIRelation.workspaces.getWorkspaceUsersByWorkspaceId(String(workspaceId));
  const list = Array.isArray(raw) ? raw : [];

  return list
    .map((item) => normalizeMember(item as Record<string, unknown>))
    .filter((item): item is WorkspaceMemberModel => item != null);
}

export async function fetchWorkspacesForCurrentUser(): Promise<{
  workspaces: WorkspaceModel[];
  memberships: WorkspaceMemberModel[];
}> {
  const userId = await getCurrentUserId();
  const memberships = await fetchWorkspaceMemberships(userId);

  const rawWorkspaces = await APIWorkspace.getWorkspaces();
  const workspaceList = Array.isArray(rawWorkspaces) ? rawWorkspaces : [];
  const workspaces = workspaceList
    .map((item) => normalizeWorkspace(item as Record<string, unknown>))
    .filter((item): item is WorkspaceModel => item != null);

  return { workspaces, memberships };
}

export async function inviteUserToWorkspaceByEmail(
  workspaceId: number,
  email: string,
): Promise<void> {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    throw new Error("Email is required.");
  }

  const users = await APIUser.getUsers();
  const userList = Array.isArray(users) ? users : [];
  const invitedUser = userList.find((user) => {
    const record = user as Record<string, unknown>;
    return String(record.email ?? record.Email ?? "").toLowerCase() === trimmedEmail;
  }) as Record<string, unknown> | undefined;

  if (!invitedUser) {
    throw new Error("No account found with that email.");
  }

  const invitedUserId = readId(invitedUser.id ?? invitedUser.Id);
  if (invitedUserId == null) {
    throw new Error("Invalid user returned by the API.");
  }

  const currentUserId = await getCurrentUserId();
  if (invitedUserId === currentUserId) {
    throw new Error("You are already a member of this workspace.");
  }

  const existingMembers = await fetchWorkspaceMembers(workspaceId);
  if (existingMembers.some((member) => member.userId === invitedUserId)) {
    throw new Error("This user is already in the workspace.");
  }

  await addUserToWorkspace(workspaceId, invitedUserId, [
    "member",
    "contributor",
    "editor",
    "viewer",
  ]);
}

export function canManageWorkspace(roleName?: string): boolean {
  const role = (roleName ?? "").toLowerCase();
  return role.includes("owner") || role.includes("admin");
}

export function getRoleForWorkspace(
  memberships: WorkspaceMemberModel[],
  workspaceId: number,
): string | undefined {
  return memberships.find((membership) => membership.workspaceId === workspaceId)?.roleName;
}
