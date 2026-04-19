import "./styles.css";
import "./apexcharts.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import the generated route tree
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
    routeTree,
    trailingSlash: "never",
    scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Render the app
const app = document.querySelector("#app")!;
if (!app.innerHTML) {
    const root = createRoot(app);
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30_000,
                refetchOnMount: false,
                refetchOnReconnect: false,
                retry: false,
                refetchOnWindowFocus: false,
            },
        },
    });
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </StrictMode>,
    );
}
