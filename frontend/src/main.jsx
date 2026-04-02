import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ProductProvider } from "./contexts/ProductContext.jsx";
import { ShiftProvider } from "./contexts/ShiftContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { SettingsProvider } from "./contexts/SettingsContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { ThemeProvider } from "next-themes";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <UserProvider>
      <SettingsProvider>
        <ModalProvider>
          <ProductProvider>
            <ShiftProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ShiftProvider>
          </ProductProvider>
        </ModalProvider>
      </SettingsProvider>
    </UserProvider>
  </ThemeProvider>
);

