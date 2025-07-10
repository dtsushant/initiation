// Sample data for dashboard components
import { ButtonMeta, FieldMeta } from "xingine";
import { LayoutComponent } from "/@/initiation/layouts/custom/utils.ts";
import { LayoutComponentDetail, LayoutRenderer } from "xingine";
import React from "react";

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

export const buttonMeta: ButtonMeta = {
  name: "collapseButton",
  content: ` <svg
    class="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>`,
  event: {
    onClick: "headerActionContext.handleToggleCollapsed",
  },
  style: {
    className: "p-2 rounded-md hover:bg-gray-100 transition-colors",
  },
};

export const buttonMeta2: ButtonMeta = {
  name: "collapseButton",
  content: `<span>clickme from content</span>`,
  event: {
    onClick: "headerActionContext.handleToggleCollapsed",
  },
  style: {
    className: "p-2 rounded-md hover:bg-gray-100 transition-colors",
  },
};

export const buttonMeta3: ButtonMeta = {
  name: "collapseButton",
  content: {
    name: "UserOutlined",
  },
  event: {
    onClick: "headerActionContext.handleToggleCollapsed",
  },
  style: {
    className: "p-2 rounded-md hover:bg-gray-100 transition-colors",
  },
};

export const createTailwindDashboardLayout = (): LayoutRenderer => {
  const chartData: LayoutComponentDetail = {
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
    meta: {
      component: "WrapperRenderer",

      properties: {
        showMeta: true,
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
  const header: LayoutComponentDetail = {
    meta: {
      component: "WrapperRenderer",
      properties: {
        style: {
          className:
            "h-16 px-4 flex items-center #{darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} justify-between",
        },
        children: [
          {
            meta: {
              component: "WrapperRenderer",
              properties: {
                style: {
                  className: "flex items-center space-x-4",
                },
                children: [
                  {
                    meta: {
                      component: "ButtonRenderer",
                      properties: {
                        name: "collapseButton",
                        content: `<svg
                              class="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>`,
                        event: {
                          onClick: "headerActionContext.handleToggleCollapsed",
                        },
                        style: {
                          className:
                            "p-2 rounded-md hover:#{darkMode ? 'bg-gray-700':'bg-gray-100'} transition-colors",
                        },
                      },
                    },
                  },
                  {
                    meta: {
                      component: "ButtonRenderer",
                      properties: {
                        name: "HomeButton",
                        content: `<svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                               <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>`,

                        style: {
                          className:
                            "p-2 rounded-md hover:#{darkMode ? 'bg-gray-700':'bg-gray-100'} transition-colors",
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            meta: {
              component: "WrapperRenderer",
              properties: {
                style: {
                  className: "flex-1 max-w-md mx-4",
                },
                children: [
                  {
                    meta: {
                      component: "InputRenderer",
                      properties: {
                        placeholder: "Search with Icon...",
                        style: {
                          className:
                            "w-full h-10 px-4 border rounded-md #{darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400':'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500",
                        },
                        icon: {
                          svg: {
                            svg: `<svg
                                                          viewBox="0 0 24 24"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          class="w-5 h-5 ">
                                                            <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>`,
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            meta: {
              component: "WrapperRenderer",
              properties: {
                className:
                  "flex items-center #{darkMode ? 'bg-gray-700':'bg-gray-100'} space-x-3",
                children: [
                  {
                    meta: {
                      component: "ConditionalRenderer",
                      properties: {
                        condition: {
                          field: "darkMode",
                          operator: "eq",
                          value: false,
                        },
                        trueComponent: {
                          meta: {
                            component: "ButtonRenderer",
                            properties: {
                              name: "DarkModeToggle",
                              content: `<svg
                                      class="w-6 h-6"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                      />
                                    </svg>`,
                              event: {
                                onClick: "headerActionContext.handleDarkMode",
                              },
                              style: {
                                className:
                                  "p-2 rounded-md #{darkMode ? 'bg-gray-700':'bg-gray-100'} hover:bg-gray-100 transition-colors",
                              },
                            },
                          },
                        },
                        falseComponent: {
                          meta: {
                            component: "ButtonRenderer",
                            properties: {
                              name: "DarkModeToggle",
                              content: `<svg
                                      class="w-6 h-6"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                      />
                                    </svg>`,
                              event: {
                                onClick: "headerActionContext.handleDarkMode",
                              },
                              style: {
                                className:
                                  "p-2 rounded-md #{darkMode ? 'bg-gray-700':'bg-gray-100'} transition-colors",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  {
                    meta: {
                      component: "ButtonRenderer",
                      properties: {
                        className:
                          "p-2 rounded-md transition-colors #{darkMode ? 'bg-gray-700':'bg-gray-100'} relative",
                        content: `<svg
                                    class="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width='2'
                                      d="M15 17h5l-5 5v-5zM15 17H9a6 6 0 01-6-6V9a6 6 0 016-6h6a6 6 0 016 6v2"
                                    />
                                  </svg>
                                  <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                                    3
                                  </span>
                                                  `,
                      },
                    },
                  },
                  {
                    meta: {
                      component: "WrapperRenderer",
                      properties: {
                        className: "relative",
                        children: [
                          {
                            meta: {
                              component: "ButtonRenderer",
                              properties: {
                                event: {
                                  onClick:
                                    "headerActionContext.setUserDropdownOpen",
                                },
                                style: {
                                  className:
                                    "flex items-center space-x-2 p-2 rounded-md transition-colors #{darkMode ? 'bg-gray-700':'bg-gray-100'}",
                                },
                                content: `<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                    U
                                                  </div>
                                                  <svg
                                                    class="w-4 h-4 transition-transform #{userDropdownOpen ? 'rotate-180' : ''}"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      stroke-width='2'
                                                      d="M19 9l-7 7-7-7"
                                                    />
                                                  </svg>`,
                              },
                            },
                          },
                          {
                            meta: {
                              component: "ConditionalRenderer",
                              properties: {
                                condition: {
                                  field: "userDropdownOpen",
                                  operator: "eq",
                                  value: true,
                                },
                                trueComponent: {
                                  meta: {
                                    component: "WrapperRenderer",
                                    properties: {
                                      className: `absolute right-0 mt-2 w-48 bg-white border #{darkMode ? 'bg-gray-800 border-gray-700':'bg-white border-gray-200'} rounded-md shadow-lg z-50`,
                                      children: [
                                        {
                                          meta: {
                                            component: "WrapperRenderer",
                                            properties: {
                                              className: "p-y-1",
                                              children: [
                                                {
                                                  meta: {
                                                    component: "ButtonRenderer",
                                                    properties: {
                                                      name: "ProfileSettingsButton",
                                                      content: "Settings",
                                                      style: {
                                                        className:
                                                          "w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md",
                                                      },
                                                    },
                                                  },
                                                },
                                                {
                                                  meta: {
                                                    component: "ButtonRenderer",
                                                    properties: {
                                                      name: "LogoutButton",
                                                      content: "Logout",
                                                      style: {
                                                        className:
                                                          "w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md text-red-600",
                                                      },
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
                                },
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
          },
        ],
      },
    },
  };

  return {
    type: "tailwind",
    style: {
      className: "min-h-screen",
    },
    header: {
      style: {
        className: "fixed top-0 left-0 right-0 h-16 z-50 shadow-sm",
      },
      meta: header,
    },
    content: {
      meta: dashboardContent,
    },
    sider: {
      meta: {},
    },
    footer: {
      meta: {},
    },
  };
};
