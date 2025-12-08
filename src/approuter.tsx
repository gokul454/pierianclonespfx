import * as React from "react";
import { useContext, useEffect, useState, lazy, Suspense } from "react";
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import { spContext } from "./App";

import Layout from "./components/layout/layout";
import Landingpage from "./components/landingpage/landingpagefull";
import ListingPage from "./components/Pages/ListingPage/Index";
import DetailPage from "./components/Pages/DetailPage/Index";


const AdminPanel = lazy(() => import("./components/AdminPanel/Index"));
const CorporateNewsManagement = lazy(() => import("./components/AdminPanel/Components/CorporateNews/Index"));
const CorporateEventsManagement = lazy(() => import("./components/AdminPanel/Components/Events/Index"));
const LatestNewsEventsManagement = lazy(() => import("./components/AdminPanel/Components/LatestNewsEvents/Index"));
const NewJoinersManagement = lazy(() => import("./components/AdminPanel/Components/NewJoiners/Index"));
const LeadershipMessagesManagement = lazy(() => import("./components/AdminPanel/Components/LeadershipMessages/Index"));
const RecognizedEmployeeManagement = lazy(() => import("./components/AdminPanel/Components/RecognizedEmployee/Index"));
const WelcomeDataManagement = lazy(() => import("./components/AdminPanel/Components/WelcomeData/Index"));
const EmployeeDirectoryManagement = lazy(() => import("./components/AdminPanel/Components/EmployeeDirectory/Index"));
const CarouselDataManagement = lazy(() => import("./components/AdminPanel/Components/CarouselData/Index"));
const HRAnnouncementManagement = lazy(() => import("./components/AdminPanel/Components/HRAnnouncements/Index"));
const PhotoVideoGalleryManagement = lazy(() => import("./components/AdminPanel/Components/PhotoVideoGallery/Index"));

const BUHeadsManagement = lazy(() => import("./components/AdminPanel/Components/BUHeads/Index"));
const QuickLinkManagement = lazy(() => import("./components/AdminPanel/Components/QuickLinks/Index"));

export default function AppRouter() {
  const { sp } = useContext(spContext);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Check if current user is an admin (same approach as your second file)
  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      try {
        const currentUser = await sp.web.currentUser.select("IsSiteAdmin")();
        if (mounted) setIsAdmin(Boolean(currentUser.IsSiteAdmin));
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (mounted) setIsAdmin(false);
      }
    };
    checkAdmin();
    return () => {
      mounted = false;
    };
  }, [sp]);

  // Avoid rendering routes until admin check has completed to prevent flicker
  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  /// Step 1: Base children first
  const baseChildren: any[] = [
    { path: "/", element: <Landingpage /> },
    { path: "listing/:listName", element: <ListingPage /> },
    { path: "detail/:listName/:id", element: <DetailPage /> }
  ];

  // Step 2: Add admin routes BEFORE routes[] is created
  if (isAdmin) {
    baseChildren.push(
      { path: 'admin', element: <AdminPanel /> },
      { path: 'admin/corporate-news', element: <CorporateNewsManagement /> },
      { path: 'admin/corporate-events', element: <CorporateEventsManagement /> },
      { path: 'admin/latest-news-events', element: <LatestNewsEventsManagement /> },
      { path: 'admin/new-joiners', element: <NewJoinersManagement /> },
      { path: 'admin/leadership-messages', element: <LeadershipMessagesManagement /> },
      { path: 'admin/recognized-employee', element: <RecognizedEmployeeManagement /> },
      { path: 'admin/welcome-data', element: <WelcomeDataManagement /> },
      { path: 'admin/employee-directory', element: <EmployeeDirectoryManagement /> },
      { path: 'admin/carousel-data', element: <CarouselDataManagement /> },
      { path: 'admin/hr-announcement', element: <HRAnnouncementManagement /> },
      { path: 'admin/photo-video-gallery', element: <PhotoVideoGalleryManagement /> },
      { path: 'admin/bu-heads', element: <BUHeadsManagement /> },
      { path: 'admin/quick-links', element: <QuickLinkManagement /> }
    );

  }

  // Step 3: NOW safely create routes[]
  const routes: any[] = [
    {
      element: (
        <Layout>
          <Outlet />
        </Layout>
      ),
      children: baseChildren
    }
  ];


  const router = createHashRouter(routes);

 return (
  <Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={router} />
  </Suspense>
);
}
