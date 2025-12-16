import * as React from 'react';
import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Carousel from "./components/Carousel";
import CorporateNews from "./components/CorporateNews";
import Events from "./components/Events";
import LatestNews from "./components/LatestNews";
import NewJoiners from "./components/NewJoiners";
import PhotoVideoGallery from "./components/PhotoVideoGallery";
import LeadershipMessage from "./components/LeadershipMessage";
import HrAnnouncements from "./components/HrAnnouncements";
import WelcomeOnboard from "./components/WelcomeOnboard";
import RecognizedEmployees from "./components/RecognizedEmployees";
import QuickLinks from "./components/QuickLinks";

import {
  getCarousalData,
  getCorporateEventsData,
  getCorporateNews,
  getDocumentsFromLibraryAsync,
  getHRAnnouncements,
  getNewgetOnboardEmployee,
  getNewJoiners,
  getNewsEvents,
  getQuickLinksData,
  getRecognizedEmployees,
} from "../../services/service";

import {
  CorporateNewsType,
  EventItem,
  GalleryItemType,
  HeroSlide,
  HRAnnouncementType,
  LeadershipMessageType,
  NewJoinerType,
  NewsEventType,
  QuickLinkType,
  RecognizedEmployeeType,
  WelcomeMessageType
} from "../../utils/types";

import { spContext } from "../../App";
import { defaultTenantUrl } from "../../utils/constant";
import "./landingpagefull.css";

import { getLeadershipMessagesItems } from "../../services/adminServices/LeadershipMessagesService/LeadershipMessagesService";
import { ThemeSettingsService } from "../../services/ThemeSettingsService";


const LandingPageFull: React.FC = () => {
  const { sp } = useContext(spContext);
  const navigate = useNavigate();

  const [carouselData, setCarouselData] = useState<HeroSlide[]>([]);
  const [corporateNewsData, setCorporateNewsData] = useState<CorporateNewsType>({
    mainEvent: null,
    sideEvents: []
  });

  const [corporateEventsData, setCorporateEventsData] = useState<{
    mainEvent: EventItem | null;
    sideEvents: EventItem[];
  }>({ mainEvent: null, sideEvents: [] });

  const [latestNewsData, setLatestNewsData] = useState<NewsEventType[]>([]);
  const [newJoinersData, setNewJoinersData] = useState<NewJoinerType[]>([]);
  const [galleryData, setGalleryData] = useState<GalleryItemType[]>([]);
  const [leadershipData, setLeadershipData] = useState<LeadershipMessageType[]>([]);
  const [hrData, setHrData] = useState<HRAnnouncementType[]>([]);
  const [welcomeData, setWelcomeData] = useState<WelcomeMessageType[]>([]);
  const [recognizedEmployees, setRecognizedEmployees] = useState<RecognizedEmployeeType[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLinkType[]>([]);

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  // theme change settings
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await ThemeSettingsService(sp).getTheme();
        document.documentElement.style.setProperty("--secondary", theme.SecondaryColor);

        // ✅ LOGO (THIS WAS MISSING)
        if (theme.LogoUrl) {
          document.documentElement.style.setProperty(
            "--app-logo",
            `url(${theme.LogoUrl})`
          );
        }
        
      } catch (err) {
        console.error("Theme load failed in LandingPage", err);
      }

    };

    loadTheme(); // ✅ THIS WAS MISSING
  }, [sp]);


  const loadAllData = async () => {
    try {
      const carousal = (await getCarousalData(sp, "MediaGallery")) ?? [];
      setCarouselData(
        carousal
          .filter((item: any) => String(item.Status).toLowerCase() === "publish")
          .map((item: any) => ({
            id: String(item.Id),
            image: item.ThumbnailURL,
            title: item.Title,
            subtitle: item.Description
          }))
      );

      const corpNews = (await getCorporateNews(sp, "CorporateNews")) ?? [];
      const mappedNews = corpNews.map((n: any) => ({
        id: n.Id,
        title: n.Title,
        description: n.Description,
        image: n.Image,
        date: n.Date,
        alt: n.Title
      }));

      setCorporateNewsData({
        mainEvent: mappedNews[0] ?? null,
        sideEvents: mappedNews.slice(1),
      });

      const corpEvents = await getCorporateEventsData(sp, "CorporateEvents");
      const mappedEvents = corpEvents.map((e: any) => ({
        id: e.Id,
        title: e.Title,
        description: e.Description,
        image: e.Image,
        date: e.Date,
        alt: e.Title
      }));

      setCorporateEventsData({
        mainEvent: mappedEvents[0] ?? null,
        sideEvents: mappedEvents.slice(1)
      });

      const newsEvents = await getNewsEvents(sp, "LatestNewsAndEvents");
      setLatestNewsData(newsEvents);

      const newJoiners = await getNewJoiners(sp, "NewJoinee");
      setNewJoinersData(
        newJoiners.map((nj: any) => ({
          id: String(nj.UserID),
          name: nj.EmployeeName,
          position: nj.Designation,
          avatar: nj.UserImage
        }))
      );

      const files = await getDocumentsFromLibraryAsync(sp, "VideoGalleryLibrary");
      setGalleryData(
        files.map((doc: any) => ({
          id: doc.Id,
          url: `${defaultTenantUrl}${doc.File.ServerRelativeUrl}`,
          imageType: doc.FileType,
          description: doc.FileLeafRef
        }))
      );

      // ⭐ THE FIX — correct list name
      const leadershipItems = (await getLeadershipMessagesItems(sp, "LeadershipMessage")) ?? [];

      setLeadershipData(
        leadershipItems
          .filter((item: any) => String(item.Status).toLowerCase() === "publish")
          .map((item: any) => ({
            id: item.ID,
            message: item.Message,
            avatar: item.UserImage,
            name: item.Title,
            title: item.Designation,
          }))
      );

      const hrItems = (await getHRAnnouncements(sp, "HRAnnouncements")) ?? [];
      setHrData(
        hrItems
          .filter((item: any) => String(item.Status).toLowerCase() === "publish")
          .map((item: any) => ({
            id: item.ID,
            subtitle: item.Title,
            description: item.Description,
            date: item.Date,
            status: item.Status
          }))
      );

      const quickLinkItems = await getQuickLinksData(sp, "QuickLinks");
      if (Array.isArray(quickLinkItems)) {
        setQuickLinks(
          quickLinkItems.map((item: any) => ({
            id: item.Id,
            url: item.CustomURL,
            label: item.Label,
            tooltip: item.Tooltip
          }))
        );
      }

      const onboardItems = (await getNewgetOnboardEmployee(sp, "EmployeeOnboard")) ?? [];
      setWelcomeData(
        onboardItems
          .filter(i => String(i.Status).toLowerCase() === "publish")
          .map(i => ({
            id: i.EmployeeID,
            message: i.Message,
            employeeName: i.EmployeeName,
            employeeImage: i.Image,
          }))
      );

      const recognized = (await getRecognizedEmployees(sp, "RecogonizedEmployee")) ?? [];
      setRecognizedEmployees(
        recognized
          .filter((i: any) => String(i.Status).toLowerCase() === "publish")
          .map((item: any) => ({
            id: item.ID,
            name: item.EmployeeName,
            position: item.Designation,
            department: item.Department,
            recognition: item.RecogonitionDescription,
            avatar: item.Image
          }))
      );

    } catch (err) {
      console.error("Error in LandingPageFull:", err);
    }
  };




  return (
    <div className="lp-wrapper">
      <div className="lp-left" ref={leftRef}>
        <Carousel slides={carouselData} />

        <CorporateNews
          mainNews={corporateNewsData.mainEvent}
          sideNews={corporateNewsData.sideEvents}
          onViewAll={() => navigate("/listing/CorporateNews")}
        />

        <Events
          mainEvent={corporateEventsData.mainEvent}
          sideEvents={corporateEventsData.sideEvents}
        />

        <div className="lp-grid-2col">
          <LatestNews newsEvents={latestNewsData} />
          <NewJoiners newJoiners={newJoinersData} />
        </div>

        <PhotoVideoGallery items={galleryData} />
      </div>

      <div className="lp-right-scroll">
        <aside className="lp-right" ref={rightRef}>
          <LeadershipMessage data={leadershipData} />
          <HrAnnouncements data={hrData} />
          <WelcomeOnboard data={welcomeData} />
          <RecognizedEmployees data={recognizedEmployees} />
          <QuickLinks quickLinks={quickLinks} />
        </aside>
      </div>
    </div>
  );
};

export default LandingPageFull;
