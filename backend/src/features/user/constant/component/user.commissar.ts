import { UserAnalyticsDto } from '../../dto/user-analytics.dto';
import { CreateRoleDto } from '../../dto/create-role.dto';
import { UserCreateDto, UserDetailDto } from '../../dto/user-create.dto';
import { UserList } from '../../dto/user-list.dto';
import { UserLoginDto } from '../../dto';
import { CommissarProperties, LayoutComponentDetailBuilder } from 'xingine';
import { CommissarOptions } from 'xingine-nest';
import { extractFormMetaFromClass } from '../../../../../.yalc/xingine';

const chartWrapperClass = `w-full h-[300px] bg-white p-4 shadow rounded`;

const chartComponent = LayoutComponentDetailBuilder.create()
  .chart()
  .charts([
    {
      type: 'bar',
      height: 300,
      width: 300,
      title: 'Sales Performance',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Sales',
          data: [4000, 3000, 2000, 2780, 1890, 2390],
          backgroundColor: '#1890ff',
        },
      ],
      style: {
        className: chartWrapperClass,
      },
    },
    {
      type: 'line',
      title: 'User Growth',
      height: 300,
      width: 300,
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Users',
          data: [240, 221, 229, 200, 218, 250],
          borderColor: '#52c41a',
        },
      ],
      style: {
        className: chartWrapperClass,
      },
    },
    {
      type: 'pie',
      title: 'Device Distribution',
      height: 300,
      width: 300,
      datasets: [
        {
          label: 'Devices',
          data: [400, 300, 300, 200],
          backgroundColor: '#1890ff',
        },
      ],
      style: {
        className: chartWrapperClass,
      },
      labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
    },
    {
      type: 'scatter',
      title: 'Revenue Analysis',
      height: 300,
      width: 300,
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Revenue',
          data: [
            { x: 1, y: 2400 },
            { x: 2, y: 1398 },
            { x: 3, y: 9800 },
            { x: 4, y: 3908 },
          ],
          backgroundColor: '#722ed1',
        },
      ],
      style: {
        className: chartWrapperClass,
      },
    },
  ])
  .build();
export const userAnalytics: CommissarOptions = {
  component: chartComponent,
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
  /*dispatch: {
    formSubmissionResponse: {},
    onSuccessRedirectTo: {
      component: 'UserDetail',
      payloadNamePath: { username: 'user.username' },
    },
  },*/
  operative: 'FormRenderer',
  component: 'UserCreate',
};

const formMeta = extractFormMetaFromClass(UserLoginDto);

const formComponent = LayoutComponentDetailBuilder.create()
  .formFromClass(UserLoginDto)
  .build();

export const userLogin: CommissarOptions = {
  component: formComponent,
  path: {
    overrideLayout: 'login',
  },
};
