import UserDashboard from "../pages/user/UserDashboard";
import UserHistory from "../pages/user/UserHistory";
import UserProfile from "../pages/user/UserProfile";

export const userPaths = [
  {
    name: "Cart",
    path: "/user/cart",
    element: <UserDashboard />,
  },
  {
    name: "Profile",
    path: "/user/profile",
    element: <UserProfile />,
  },
  {
    name: "Orders",
    path: "/user/orders",
    element: <UserHistory />,
  },
];