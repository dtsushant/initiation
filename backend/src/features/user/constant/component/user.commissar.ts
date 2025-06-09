import { UserAnalyticsDto } from '../../dto/user-analytics.dto';
import { CreateRoleDto } from '../../dto/create-role.dto';
import { UserCreateDto, UserDetailDto } from '../../dto/user-create.dto';
import { UserList } from '../../dto/user-list.dto';
import { UserLoginDto } from '../../dto';
import { CommissarProperties } from 'xingine';

export const userAnalytics: CommissarProperties = {
  directive: UserAnalyticsDto,
  operative: 'ChartRenderer',
  component: 'UserAnalytics',
};

export const addRole: CommissarProperties = {
  directive: CreateRoleDto,
  operative: 'FormRenderer',
  component: 'AddRole',
};
export const userDetail: CommissarProperties = {
  directive: UserDetailDto,
  operative: 'DetailRenderer',
  component: 'UserDetail',
};
export const userList: CommissarProperties = {
  directive: UserList,
  operative: 'TableRenderer',
  component: 'UserList',
};

export const createUser: CommissarProperties = {
  directive: UserCreateDto,
  dispatch: {
    formSubmissionResponse: {},
    onSuccessRedirectTo: {
      component: 'UserDetail',
      payloadNamePath: { username: 'user.username' },
    },
  },
  operative: 'FormRenderer',
  component: 'UserCreate',
};

export const userLogin: CommissarProperties = {
  directive: UserLoginDto,
  operative: 'FormRenderer',
  component: 'UserLogin',
  layout: 'LoginLayout',
};
