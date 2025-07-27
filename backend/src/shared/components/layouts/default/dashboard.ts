import {
  CommissarBuilder,
  LayoutComponentDetail,
  LayoutComponentDetailBuilder,
} from 'xingine';

const userFormFields = [
  {
    name: 'name',
    label: 'Name',
    inputType: 'input' as const,
    required: true,
    properties: {},
  },
  {
    name: 'email',
    label: 'Email',
    inputType: 'input' as const,
    required: true,
    properties: {},
  },
  {
    name: 'role',
    label: 'Role',
    inputType: 'select',
    properties: {},
  },
];

const userTableData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    active: true,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    active: true,
    createdAt: '2024-01-02',
  },
];

const userDetailData = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Admin',
  active: true,
  createdAt: '2024-01-01',
  lastLogin: '2024-01-15T10:30:00Z',
  profile: {
    avatar: 'https://example.com/avatar.jpg',
    department: 'Engineering',
    phone: '+1-555-0123',
    bio: 'Software engineer with 5 years of experience in web development.',
  },
  permissions: ['read', 'write', 'admin'],
};

// Create chart component using the builder
//const chartWrapperClass = `min-w-[150px] flex-1 sm:max-w-[calc(25%-1rem)] bg-gray-100 p-4 rounded`;
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

// Create form component using the builder
const formComponent = LayoutComponentDetailBuilder.create()
  .withMeta('FormRenderer', {
    action: 'handleUserCreate',
    fields: userFormFields,
    event: {
      onSubmit: {
        action: 'navigate',
        args: {
          path: '/thank-you',
        },
      },
    },
    properties: {
      title: 'Create User',
      submitText: 'Create User',
      className: 'bg-white dark:bg-gray-800 p-6 rounded-lg shadow',
    },
  } as any)
  .build();

// Create table component using the builder
const tableComponent = LayoutComponentDetailBuilder.create()
  .table()
  .dataSourceUrl('/api/users')
  .columns([
    { title: 'Name', dataIndex: 'name', key: 'name', sortable: true },
    { title: 'Email', dataIndex: 'email', key: 'email', sortable: true },
    { title: 'Role', dataIndex: 'role', key: 'role', sortable: true },
    { title: 'Status', dataIndex: 'active', key: 'active' },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' },
  ])
  .build();

// Create detail component using the builder
const detailComponent = LayoutComponentDetailBuilder.create()
  .detailRenderer()
  .action('viewUser')
  .fields([
    { name: 'name', label: 'Name', inputType: 'text' as const, properties: {} },
    {
      name: 'email',
      label: 'Email',
      inputType: 'text' as const,
      properties: {},
    },
    {
      name: 'role',
      label: 'Role',
      inputType: 'badge' as const,
      properties: {},
    },
    {
      name: 'active',
      label: 'Status',
      inputType: 'switch' as const,
      properties: {},
    },
    {
      name: 'createdAt',
      label: 'Created',
      inputType: 'date' as const,
      properties: {},
    },
    {
      name: 'lastLogin',
      label: 'Last Login',
      inputType: 'date' as const,
      properties: {},
    },
  ])
  .build();

// Create popup component using the builder
const popupComponent = LayoutComponentDetailBuilder.create()
  .popup()
  .property('title', 'User Profile Details')
  .property('triggerText', 'View Full Profile')
  .property('width', 800)
  .property('height', 600)
  .property(
    'content',
    `
        <div class="flex items-center space-x-4">
          <img src="${userDetailData.profile.avatar}" alt="Profile" class="w-20 h-20 rounded-full">
          <div>
            <h2 class="text-2xl font-bold">${userDetailData.name}</h2>
            <p class="text-gray-600">${userDetailData.profile.department} Department</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold mb-2">Contact Information</h3>
            <p><strong>Email:</strong> ${userDetailData.email}</p>
            <p><strong>Phone:</strong> ${userDetailData.profile.phone}</p>
          </div>
          <div>
            <h3 class="font-semibold mb-2">Role & Permissions</h3>
            <p><strong>Role:</strong> ${userDetailData.role}</p>
            <p><strong>Permissions:</strong> ${userDetailData.permissions.join(', ')}</p>
          </div>
        </div>
        <div>
          <h3 class="font-semibold mb-2">Biography</h3>
          <p>${userDetailData.profile.bio}</p>
        </div>
      `,
  )
  .build();

const imageRendererExample: LayoutComponentDetail =
  LayoutComponentDetailBuilder.create()
    .withMeta('ImageRenderer', {
      src: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Dashboard hero image',
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      className: 'rounded-lg shadow-md transition-transform hover:scale-105',
      loading: 'lazy',
      placeholder: 'Loading dashboard image...',
      fallbackSrc:
        'https://via.placeholder.com/800x200/f0f0f0/999999?text=Dashboard+Image',
      animation: {
        type: 'fade',
        duration: 300,
        delay: 100,
      },
      onClick: () => {
        console.log('Dashboard image clicked');
      },
      onLoad: () => {
        console.log('Dashboard image loaded successfully');
      },
      onError: () => {
        console.log('Dashboard image failed to load');
      },
      'data-testid': 'dashboard-hero-image',
      'data-component': 'DashboardImageRenderer',
      title: 'Click to view full dashboard analytics',
      'aria-label': 'Dashboard analytics overview image',
      style: {
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
      },
    })
    .build();

// Create dashboard content with nested structure
export const DEFAULT_DASHBOARD_COMMISAR = CommissarBuilder.create()
  .path('/home')
  .wrapper()
  .className('min-h-full max-w-full w-full')
  .addChild(
    // Charts Row
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className(
        'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}',
      )
      .style({
        background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
        color: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
      })
      .addChild(chartComponent)
      .build(),
  )
  .addChild(
    // Form and Table Row
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className(
        'w-full bg-white shadow mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}',
      )
      .addChild(formComponent)
      .build(),
  )
  .addChild(
    // Form and Table Row
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className(
        'w-full bg-white mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}',
      )
      .addChild(tableComponent)
      .build(),
  )
  .addChild(
    // Detail and Popup Row
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className(
        'grid grid-cols-1 gap-6 mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}',
      )
      .addChild(
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className(
            'mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}',
          )
          .addChild(detailComponent)
          .addChild(popupComponent)
          .build(),
      )
      .build(),
  )
  .addChild(
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className(
        'flex gap-4 mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}',
      ) // row layout with gap
      .addChildren([
        // Left (Progress / Chart) - 80%
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('basis-[80%] grow bg-white p-4 rounded shadow')
          .content('Progress Chart Section')
          .build(),

        // Right (User Stats) - 20%
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('basis-[20%] bg-white p-4 rounded shadow')
          .content('User Stats List')
          .build(),
      ])
      .build(),
  )
  .addChild(imageRendererExample)
  .build();
