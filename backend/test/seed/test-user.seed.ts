import { UserService } from '../../src/features/user/service/user.service';
import { CreateUserDto } from '../../src/features/user/dto';
import { IUserRO } from '../../src/features/user/user.interface';
import { UserCreateDto } from '../../src/features/user/dto/user-create.dto';

export async function createTestUser(
  userService: UserService,
): Promise<IUserRO> {
  const testUser: UserCreateDto = {
    identity: {
      username: 'testuser2',
      email: 'test2@test.com',
      password: 'secret123',
      firstName: 'Test',
      lastName: 'User',
    },
  };
  try {
    return await userService.create(testUser);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteTestUser(userService: UserService, email: string) {
  await userService.delete(email);
}
