import UserDashboard from "../pages/user/UserDashboard";
import UserHistory from "../pages/user/UserHistory";
import UserProfile from "../pages/user/UserProfile";

export const userPaths = [
  {
    name: "UserDashboard",
    path: "/user/dashboard",
    element: <UserDashboard />,
  },
  {
    name: "Profile",
    path: "/user/profile",
    element: <UserProfile />,
  },
  {
    name: "History",
    path: "/user/history",
    element: <UserHistory />,
  },
];