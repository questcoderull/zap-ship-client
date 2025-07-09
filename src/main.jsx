import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router/router";
import { RouterProvider } from "react-router";
import "aos/dist/aos.css";
import Aos from "aos";
import AuthProvider from "./Contexts/AuthContext/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
Aos.init();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-urbanist max-w-7xl mx-auto">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
