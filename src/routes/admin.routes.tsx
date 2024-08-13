import CreateAdmin from "../pages/admin/CreateAdmin";
import CreateProduct from "../pages/admin/CreateProduct";
import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Orders";
import PreviousShipments from "../pages/admin/PreviousShipments";
import Products from "../pages/admin/Products";

export const adminPaths = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    element: <Dashboard />,
  },
  {
    name: "Orders",
    path: "/admin/all-orders",
    element: <Orders />,
  },
  {
    name: "Products",
    path: "/admin/all-products",
    element: <Products />,
  },
  {
    name: "Management",
    children: [
      {
        name: "Create Product",
        path: "/admin/create-product",
        element: <CreateProduct />,
      },
      {
        name: "Create Admin",
        path: "/admin/create-admin",
        element: <CreateAdmin />,
      },
      {
        name: "Previous Shipments",
        path: "/admin/previous-shipments",
        element: <PreviousShipments />,
      },
    ],
  },
];