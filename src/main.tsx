import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppProviders from "@/components/AppProviders";
import AppRoutes from "@/components/AppRoutes";

console.log("🔍 Main.tsx: Initializing app with React Router and authentication");

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <BrowserRouter>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </BrowserRouter>
);