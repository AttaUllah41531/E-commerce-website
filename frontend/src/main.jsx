import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ProductProvider } from "./contexts/ProductContext.jsx";
import { ShiftProvider } from "./contexts/ShiftContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <ProductProvider>
      <ShiftProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ShiftProvider>
    </ProductProvider>
  </UserProvider>
);
