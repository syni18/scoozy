import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navigation from "./components/navigation/Navigation";
import "./App.css"; // Ensure global CSS is imported

// Layout Component
const Layout = ({ children, showHeaderFooter = true }) => (
  <>
    {showHeaderFooter && <Navigation />}
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    {/* {showHeaderFooter && <Footer />} */}
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        {/* <Banner />
        <HomePage /> */}
      </Layout>
    ),
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
