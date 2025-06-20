# User Management Features Documentation

## Overview

This document describes the comprehensive user management system implemented in the application, including user profiles, roles, groups, permissions, and role inheritance logic.

## Entities

### User
The main user entity contains basic user information and authentication details.

**Key Fields:**
- `id`: UUID primary key
- `username`: Unique username
- `email`: Unique email address
- `firstName`, `lastName`: User's name
- `bio`, `image`: Profile information
- `isActive`, `isLocked`: Account status
- `emailVerified`, `phoneVerified`: Verification status
- `mfaEnabled`, `mfaMethod`: Multi-factor authentication settings
- `lastLogin`: Last login timestamp

**Relationships:**
- One-to-many with `UserPassword` (password history)
- One-to-one with `UserProfile` (detailed profile information)
- Many-to-many with `Role` (direct role assignments)
- Many-to-many with `Group` (group memberships)
- Many-to-many with `Group` as managers (groups user manages)

### UserProfile
Extended user information stored separately from the main User entity.

**Key Fields:**
- `id`: UUID primary key
- `phone`, `alternatePhone`: Contact numbers
- `address`, `city`, `state`, `country`, `postalCode`: Address information
- `dateOfBirth`: User's date of birth
- `organization`, `department`, `jobTitle`: Work information
- `panVatNo`: Tax identification
- `emergencyContactName`, `emergencyContactPhone`, `emergencyContactRelation`: Emergency contact

**Relationships:**
- One-to-one with `User` (owner relationship)

### Role
Represents a role that can be assigned to users or groups.

**Key Fields:**
- `id`: UUID primary key
- `name`: Role name (e.g., "Administrator", "Manager")
- `description`: Role description
- `createdAt`, `updatedAt`: Timestamps

**Relationships:**
- Many-to-many with `Permission` (role permissions)
- Many-to-many with `User` (users with this role)
- Many-to-many with `Group` (groups with this role)

### Permission
Represents a specific permission (e.g., "user.create", "inventory.read").

**Key Fields:**
- `id`: Text-based permission identifier
- `description`: Permission description

**Relationships:**
- Many-to-many with `Role` (roles that have this permission)
- Many-to-one with `AppDetail` (module this permission belongs to)

### Group
Represents a group of users with optional command structure.

**Key Fields:**
- `id`: UUID primary key
- `name`: Group name
- `description`: Group description
- `createdAt`, `updatedAt`: Timestamps

**Special Relationships:**
- `command`: Many-to-one with `User` (group commander)
- `secondInCommand`: Many-to-one with `User` (second in command)
- `members`: Many-to-many with `User` (group members)
- `managers`: Many-to-many with `User` (group managers)
- `roles`: Many-to-many with `Role` (roles assigned to group)

## Role Inheritance Logic

The system implements a sophisticated role inheritance mechanism:

### 1. Direct Role Assignment
Users can have roles assigned directly to them through the `user_roles` pivot table.

### 2. Group-Based Role Inheritance
Users inherit roles from all groups they are members of. This allows for:
- Department-based role assignment
- Project team role inheritance
- Hierarchical organization structures

### 3. Role Aggregation
When determining a user's effective roles and permissions, the system:
1. Collects all directly assigned roles
2. Collects all roles from groups the user is a member of
3. Deduplicates roles (same role from multiple sources counts as one)
4. Aggregates all permissions from all effective roles

## Service Methods

### UserProfile Management

#### `createUserProfile(userId: string, profileData: CreateUserProfileDto): Promise<UserProfile>`
Creates a new user profile for the specified user.

**Example:**
```typescript
const profile = await userService.createUserProfile(userId, {
  phone: '+1234567890',
  address: '123 Main St',
  city: 'New York',
  organization: 'Acme Corp',
  jobTitle: 'Developer'
});
```

#### `updateUserProfile(userId: string, profileData: UpdateUserProfileDto): Promise<UserProfile>`
Updates an existing user profile.

#### `getUserProfile(userId: string): Promise<UserProfile>`
Retrieves a user's profile information.

### Group Management

#### `createGroup(groupData: CreateGroupDto): Promise<Group>`
Creates a new group with optional command structure and initial members/roles.

**Example:**
```typescript
const group = await userService.createGroup({
  name: 'Development Team',
  description: 'Software development team',
  commandId: managerId,
  secondInCommandId: teamLeadId,
  memberIds: [dev1Id, dev2Id, dev3Id],
  roleIds: [developerRoleId]
});
```

#### `updateGroup(groupId: string, groupData: UpdateGroupDto): Promise<Group>`
Updates group information, command structure, members, and roles.

#### `getGroup(groupId: string): Promise<Group>`
Retrieves a group with all its relationships populated.

#### `getAllGroups(): Promise<Group[]>`
Retrieves all groups in the system.

### Role Aggregation

#### `getUserAggregatedRoles(userId: string): Promise<Role[]>`
Returns all effective roles for a user (direct + inherited from groups).

#### `getUserAggregatedPermissions(userId: string): Promise<Permission[]>`
Returns all effective permissions for a user from all their roles.

#### `userHasPermission(userId: string, permissionId: string): Promise<boolean>`
Checks if a user has a specific permission (directly or through groups).

#### `userHasRole(userId: string, roleId: string): Promise<boolean>`
Checks if a user has a specific role (directly or through groups).

## API DTOs

### UserProfile DTOs

#### `CreateUserProfileDto`
```typescript
{
  phone?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string; // ISO date string
  organization?: string;
  department?: string;
  jobTitle?: string;
  panVatNo?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
}
```

### Group DTOs

#### `CreateGroupDto`
```typescript
{
  name: string;
  description?: string;
  commandId?: string; // User ID
  secondInCommandId?: string; // User ID
  memberIds?: string[]; // Array of User IDs
  roleIds?: string[]; // Array of Role IDs
}
```

## Database Schema

### New Tables
1. `iam.user_profiles` - User profile information
2. Updated `iam.roles` - Added `name` field
3. Updated `iam.groups` - Added `command_id` and `second_in_command_id`

### Pivot Tables
- `iam.user_roles` - User-Role assignments
- `iam.user_groups` - User-Group memberships
- `iam.group_roles` - Group-Role assignments
- `iam.role_permissions` - Role-Permission assignments
- `iam.group_managers` - Group management assignments

## Usage Examples

### Setting up a Department with Hierarchy

```typescript
// Create roles
const managerRole = await roleService.create({
  name: 'Department Manager',
  description: 'Can manage department operations'
});

const employeeRole = await roleService.create({
  name: 'Employee',
  description: 'Basic employee permissions'
});

// Create department group
const department = await userService.createGroup({
  name: 'Engineering Department',
  description: 'Software engineering department',
  commandId: managerId,
  secondInCommandId: teamLeadId,
  memberIds: [managerId, teamLeadId, dev1Id, dev2Id],
  roleIds: [employeeRole.id] // Base role for all members
});

// Assign manager role directly to manager
await assignRoleToUser(managerId, managerRole.id);

// Now all department members have employee role through group
// Manager has both employee role (from group) and manager role (direct)
```

### Checking User Permissions

```typescript
// Check if user can perform specific action
const canCreateUser = await userService.userHasPermission(userId, 'user.create');
const canManageInventory = await userService.userHasPermission(userId, 'inventory.manage');

// Get all user's effective roles and permissions
const roles = await userService.getUserAggregatedRoles(userId);
const permissions = await userService.getUserAggregatedPermissions(userId);
```

## Security Considerations

1. **Role Inheritance**: Users automatically inherit roles from groups, reducing administrative overhead
2. **Least Privilege**: Base permissions through groups, additional permissions through direct role assignment
3. **Audit Trail**: All role and group changes are timestamped
4. **Separation of Concerns**: Profile data is separate from authentication data
5. **Command Structure**: Groups support military-style command hierarchy for organizational clarity

## Testing

The implementation includes comprehensive tests:

### Unit Tests (`user-enhanced.service.spec.ts`)
- UserProfile CRUD operations
- Group management with command structure
- Role aggregation logic
- Permission checking
- Entity relationships

### E2E Tests (`user-enhanced.e2e-spec.ts`)
- Full workflow testing with real database
- Data integrity verification
- Cross-entity relationship testing

### Test Coverage
- All service methods
- Error handling scenarios
- Edge cases (duplicate profiles, non-existent users, etc.)
- Role deduplication logic
- Command structure assignments

## Migration Considerations

When deploying these changes:

1. **Database Migration**: Run migrations to add new tables and columns
2. **Existing Data**: Existing users will not have profiles initially
3. **Role Names**: Existing roles will need names added
4. **Group Structure**: Existing groups will not have command structure initially
5. **Backward Compatibility**: All existing functionality remains unchanged