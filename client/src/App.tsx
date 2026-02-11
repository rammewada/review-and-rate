import Navbar from "./components/Navbar.tsx";
import { Outlet } from "react-router-dom";
import { CompanyFilterProvider } from "./context/CompanyFilterContext";

function App() {
  return (
    <CompanyFilterProvider>
      <Navbar />
      <Outlet />
    </CompanyFilterProvider>
  );
}

export default App;
