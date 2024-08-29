// import AdminLayout from "./components/layout/AdminLayout"
import { useEffect } from "react";
import HomeLayout from "./components/layout/HomeLayout";

function App() {
  
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        "Are you sure you want to reload the page? You may lost unsaved items.";
    };

    // Add the event listener to handle before unload for the entire app
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <HomeLayout />;
  // return <AdminLayout/>;
}

export default App;
