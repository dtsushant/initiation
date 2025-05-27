import { UIComponent } from "@xingine";

export const modules: UIComponent[] = [
  {
    component: "FormRenderer",
    path: "/users/create",
    icon: "user-plus",
    roles: ["admin"],
    permissions: ["user.create"],
    meta: {
      fields: [
        { name: "email", label: "Email", inputType: "text", required: true },
        {
          name: "password",
          label: "Password",
          inputType: "password",
          required: true,
        },
      ],
    },
  },
  {
    component: "TableRenderer",
    path: "/users/list",
    icon: "list",
    roles: ["admin", "manager"],
    permissions: ["user.read"],
    meta: {
      columns: [
        { field: "email", headerName: "Email" },
        { field: "createdAt", headerName: "Created At" },
      ],
      dataSourceUrl: "/api/users",
    },
  },
];
