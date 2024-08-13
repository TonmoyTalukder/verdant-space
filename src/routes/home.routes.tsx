import AllProducts from "../pages/home/AllProducts";
import Articles from "../pages/home/Articles";
import Contact from "../pages/home/Contact";
import FrequentlyAskedQuestions from "../pages/home/FrequentlyAskedQuestions";
import Home from "../pages/home/Home";
import SupplyProducts from "../pages/home/SupplyProducts";

export const homePaths = [
    {
        name: "Home",
        path: "/home",
        element: <Home/>,
    },
    {
        name: "All Products",
        path: "/shop",
        element: <AllProducts/>,
    },
    {
        name: "Supply Products",
        path: "/supply",
        element: <SupplyProducts/>,
    },
    {
        name: "Articles",
        path: "/articles",
        element: <Articles/>,
    },
    {
        name: "FAQ",
        path: "/faq",
        element: <FrequentlyAskedQuestions/>,
    },
    {
        name: "Contact",
        path: "/contact",
        element: <Contact/>,
    },

]