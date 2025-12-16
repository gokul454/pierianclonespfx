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

// ⭐ ADD THEME SETTINGS (Final correct import)
const ThemeSettingsManagement = lazy(() => import("./components/AdminPanel/Components/settings/AdminThemeSettings"));

export default function AppRouter() {
  const { sp } = useContext(spContext);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      try {
        const currentUser = await sp.web.currentUser.select("IsSiteAdmin")();
        if (mounted) setIsAdmin(Boolean(currentUser.IsSiteAdmin));
      } catch {
        if (mounted) setIsAdmin(false);
      }
    };
    checkAdmin();
    return () => { mounted = false };
  }, [sp]);

  if (isAdmin === null) return <div>Loading...</div>;

  const baseChildren: any[] = [
    { path: "/", element: <Landingpage /> },
    { path: "listing/:listName", element: <ListingPage /> },
    { path: "detail/:listName/:id", element: <DetailPage /> }
  ];

  if (isAdmin) {
    baseChildren.push(
      { path: "admin", element: <AdminPanel /> },
      { path: "admin/corporate-news", element: <CorporateNewsManagement /> },
      { path: "admin/corporate-events", element: <CorporateEventsManagement /> },
      { path: "admin/latest-news-events", element: <LatestNewsEventsManagement /> },
      { path: "admin/new-joiners", element: <NewJoinersManagement /> },
      { path: "admin/leadership-messages", element: <LeadershipMessagesManagement /> },
      { path: "admin/recognized-employee", element: <RecognizedEmployeeManagement /> },
      { path: "admin/welcome-data", element: <WelcomeDataManagement /> },
      { path: "admin/employee-directory"  , element: <EmployeeDirectoryManagement /> },
      { path: "admin/carousel-data", element: <CarouselDataManagement /> },
      { path: "admin/hr-announcement", element: <HRAnnouncementManagement /> },
      { path: "admin/photo-video-gallery", element: <PhotoVideoGalleryManagement /> },
      { path: "admin/bu-heads", element: <BUHeadsManagement /> },
      { path: "admin/quick-links", element: <QuickLinkManagement /> },
      { path: "admin/theme-settings", element: <ThemeSettingsManagement /> }
    );
  }

  const routes = [
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
