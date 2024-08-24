import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/common/Login";
import Register from "../pages/common/Register";
import UserLayout from "../components/layout/UserLayout";
import { adminPaths } from "./admin.routes";
import { routeGenerator } from "../utils/routesGenerator";
import { userPaths } from "./user.routes";
import { homePaths } from "./home.routes";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: routeGenerator(homePaths),
    },
    {
        path: '/admin',
        element: <UserLayout/>,
        children: routeGenerator(adminPaths),
    },
    {
        path: '/user',
        element: <UserLayout/>,
        children: routeGenerator(userPaths),
    },
    // {
    //     path: '/shop/:productId',
    //     element: <Product/>,
    // },
    {
        path: '/login',
        element: <Login/>,
    },
    {
        path: '/register',
        element: <Register/>,
    },
]);

export default router;