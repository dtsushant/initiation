import { UserService } from '../../src/features/user/service/user.service';
import { CreateUserDto } from '../../src/features/user/dto';
import { IUserRO } from '../../src/features/user/user.interface';

export async function createTestUser(
  userService: UserService,
): Promise<IUserRO> {
  const testUser: CreateUserDto = {
    username: 'testuser2',
    email: 'test2@test.com',
    password: 'secret123',
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
