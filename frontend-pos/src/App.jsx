// import toaster
import { Toaster } from "react-hot-toast";

// import react and useEffect
import { useEffect } from "react";

// import theme store
import { useStore } from "./stores/theme";

function App() {
  // destructure state "theme" from useStore
  const { theme } = useStore();

  // set document theme
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <>
      <Toaster />
    </>
  );
}

export default App;
