// Sample data for dashboard components
import { FieldMeta } from "xingine";
import { LayoutComponent } from "/@/initiation/layouts/custom/utils.ts";
import { LayoutComponentDetail, LayoutRenderer } from "xingine";

const chartData = {
  barChart: [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 700 },
  ],
  lineChart: [
    { name: "Week 1", value: 100 },
    { name: "Week 2", value: 200 },
    { name: "Week 3", value: 150 },
    { name: "Week 4", value: 300 },
  ],
  pieChart: [
    { name: "Desktop", value: 400 },
    { name: "Mobile", value: 300 },
    { name: "Tablet", value: 100 },
  ],
  areaChart: [
    { name: "Q1", value: 1000 },
    { name: "Q2", value: 1200 },
    { name: "Q3", value: 900 },
    { name: "Q4", value: 1500 },
  ],
};

const userFormFields: FieldMeta[] = [
  {
    name: "name",
    label: "Full Name",
    inputType: "input",
    required: true,
    properties: {
      placeholder: "Enter full name",
      maxLength: 50,
      minLength: 3,
      pattern: "^[a-zA-Z ]+$",
      validationMessage:
        "Name must be at least 3 characters long and contain only letters and spaces.",
    },
  },
  {
    name: "email",
    label: "Email",
    inputType: "input",
    required: true,
    properties: {
      placeholder: "Enter email address",
      maxLength: 100,
      minLength: 5,
      email: true,
    },
  },
  {
    name: "role",
    label: "Role",
    inputType: "select",
    required: true,
    properties: {
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Manager", value: "manager" },
      ],
    },
  },
  {
    name: "active",
    label: "Active",
    inputType: "switch",
    properties: { defaultChecked: true },
  },
];

const userTableData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    active: true,
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Manager",
    active: false,
    createdAt: "2024-01-05",
  },
];

const userDetailData = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  role: "Admin",
  active: true,
  createdAt: "2024-01-15",
  lastLogin: "2024-12-24T10:30:00Z",
  permissions: ["read", "write", "delete"],
  profile: {
    avatar: "https://via.placeholder.com/100",
    bio: "Experienced administrator with 5+ years in system management.",
    department: "IT",
    phone: "+1234567890",
  },
};

export const createTailwindDashboardLayout = (): LayoutRenderer => {
  const chartData: LayoutComponentDetail = {
    component: "ChartRenderer",
    meta: {
      component: "ChartRenderer",
      properties: {
        charts: [
          {
            type: "bar",
            height: 300,
            width: 300,
            title: "Sales Performance",
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Sales",
                data: [4000, 3000, 2000, 2780, 1890, 2390],
                backgroundColor: "#1890ff",
              },
            ],
          },
          {
            type: "line",
            title: "User Growth",
            height: 300,
            width: 300,
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Users",
                data: [240, 221, 229, 200, 218, 250],
                borderColor: "#52c41a",
              },
            ],
          },
          {
            type: "pie",
            title: "Device Distribution",
            height: 300,
            width: 300,
            datasets: [
              {
                label: "Devices",
                data: [400, 300, 300, 200],
                backgroundColor: "#1890ff", // Single color for pie chart
              },
            ],
            labels: ["Desktop", "Mobile", "Tablet", "Other"],
          },
          {
            type: "scatter",
            title: "Revenue Analysis",
            height: 300,
            width: 300,
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [
              {
                label: "Revenue",
                data: [
                  { x: 1, y: 2400 },
                  { x: 2, y: 1398 },
                  { x: 3, y: 9800 },
                  { x: 4, y: 3908 },
                ],
                backgroundColor: "#722ed1",
              },
            ],
          },
        ],
      },
    },
  };
  const chartDetail: LayoutComponent = new LayoutComponent(chartData);

  const formData = new LayoutComponent({
    component: "FormRenderer",
    meta: {
      component: "FormRenderer",
      properties: {
        title: "Create User",
        fields: userFormFields,
        onSubmit: "handleUserCreate",
        submitText: "Create User",
        className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow",
      },
    },
  });

  const tableData: LayoutComponent = new LayoutComponent({
    component: "TableRenderer",
    meta: {
      component: "TableRenderer",
      properties: {
        title: "Users",
        data: userTableData,
        columns: [
          { key: "name", title: "Name", sortable: true },
          { key: "email", title: "Email", sortable: true },
          { key: "role", title: "Role", sortable: true },
          { key: "active", title: "Status", type: "badge" },
          { key: "createdAt", title: "Created", type: "date" },
        ],
        pagination: true,
        pageSize: 10,
        className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow",
      },
    },
  });

  const detailData: LayoutComponent = new LayoutComponent({
    component: "DetailRenderer",
    meta: {
      component: "DetailRenderer",
      properties: {
        title: "User Details",
        data: userDetailData,
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "email", label: "Email", type: "text" },
          { key: "role", label: "Role", type: "badge" },
          { key: "active", label: "Status", type: "switch" },
          { key: "createdAt", label: "Created", type: "date" },
          { key: "lastLogin", label: "Last Login", type: "datetime" },
        ],
      },
    },
  });

  const popupData = new LayoutComponent({
    component: "PopupRenderer",
    meta: {
      component: "PopupRenderer",
      properties: {
        title: "User Profile Details",
        triggerText: "View Full Profile",
        width: 800,
        height: 600,
        content: `
                      <div class="space-y-6">
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
                            <p><strong>Permissions:</strong> ${userDetailData.permissions.join(", ")}</p>
                          </div>
                        </div>
                        <div>
                          <h3 class="font-semibold mb-2">Biography</h3>
                          <p>${userDetailData.profile.bio}</p>
                        </div>
                      </div>
                    `,
      },
    },
  });

  const dashboardContent: LayoutComponent = new LayoutComponent({
    component: "WrapperRenderer",
    content: "<div>This content is rendered dangerously</div>",

    meta: {
      component: "WrapperRenderer",
      properties: {
        className:
          " min-h-full max-w-full w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8",
        children: [
          // Charts Row
          {
            isMenuItem: false,
            component: "WrapperRenderer",
            meta: {
              component: "WrapperRenderer",
              properties: {
                showMeta: true,
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8",
                style: {
                  background: "linear-gradient(135deg, #ff7e5f, #feb47b)", // orange to peach gradient
                  color: "#ffffff",
                  padding: "16px",
                  borderRadius: "8px",
                },
                children: [chartData],
              },
            },
          },

          // Form and Table Row
          {
            isMenuItem: false,
            component: "WrapperRenderer",
            meta: {
              component: "WrapperRenderer",
              properties: {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8",
                children: [
                  // User Creation Form

                  // User Table
                  tableData,
                  formData,
                ],
              },
            },
          },

          // Detail and Popup Row
          {
            isMenuItem: false,
            component: "WrapperRenderer",
            meta: {
              component: "WrapperRenderer",
              properties: {
                className: "grid grid-cols-1 gap-6",
                children: [
                  // User Detail with Popup
                  {
                    isMenuItem: false,
                    component: "WrapperRenderer",
                    meta: {
                      component: "WrapperRenderer",
                      properties: {
                        className:
                          "bg-white dark:bg-gray-800 p-6 rounded-lg shadow",

                        children: [detailData, popupData],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  });

  return {
    type: "tailwind",
    style: {
      className: "min-h-screen",
    },
    header: {
      style: {
        className: "fixed top-0 left-0 right-0 h-16 z-50 shadow-sm",
      },
      meta: {
        component: "HeaderRenderer",
      },
    },
    content: {
      meta: dashboardContent,
    },
    sider: {
      meta: {
        component: "SidebarRenderer",
      },
    },
    footer: {
      meta: {
        component: "FooterRenderer",
      },
    },
  };
};
