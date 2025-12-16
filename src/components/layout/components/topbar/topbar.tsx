import * as React from 'react';
import { useState, useContext, useEffect } from "react";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./topbar.css";

import { spContext } from "../../../../App";
import { defaultTenantUrl } from "../../../../utils/constant";
import { TopNavLinks } from "../../../../utils/customSettings";
import { SearchQueryBuilder } from "@pnp/sp/search";
import Breadcrumbs from "../../../landingpage/Common Breadcrumbs Navigation/Breadcrumbs";
import { ThemeSettingsService } from "../../../../services/ThemeSettingsService";


const TopNav: React.FC = () => {
  const { context, sp } = useContext(spContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Avatar from SharePoint
  const avatarUrl = `${defaultTenantUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${context.pageContext.user.email}`;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery) {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        navigate("/");
        return;
      }
    }
  }, []);

  const handleSearch = async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      navigate("/");
      return;
    }

    setLoading(true);
    try {
      const query = SearchQueryBuilder(`*${trimmed}*`)
        .selectProperties("Title,Path,Description,Author,Editor")
        .rowLimit(50);

      const results = await sp.search(query);
      const items = results.PrimarySearchResults;

      navigate("/search-details", {
        state: {
          results: items,
          term: trimmed,
        },
      });
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };



  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await ThemeSettingsService(sp).getTheme();

        if (theme.LogoUrl) {
          document.documentElement.style.setProperty(
            "--topnav-logo",
            `url(${theme.LogoUrl})`
          );
        }
      } catch (err) {
        console.error("Failed to load theme in TopNav", err);
      }
    };

    loadTheme();
  }, [sp]);


  return (
    <div>
      <div className="top-nav">

        <div className="left">
          <div
            className="logo"
            onClick={() => navigate("/")}
            style={{
              height: "64px",
              maxHeight: "64px",
              width: "64px",
              maxWidth: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <div className="top-nav-logo" />
          </div>

          <p className="insights-nav">Insights to Impact</p>
        </div>

        {/* RIGHT SIDE — DESKTOP */}
        <div className="right desktop">
          {/* NAV LINKS */}
          <div className="nav-links">
            {TopNavLinks.map((label, index) => (
              <span className="nav-link" key={index}>
                {label}
              </span>
            ))}
          </div>

          {/* SEARCH */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />

            <button className="search-button" type="button" onClick={handleSearch}>
              {loading ? (
                <span className="search-spinner" />
              ) : (
                <SearchOutlined className="search-icon" />
              )}
            </button>
          </div>

          {/* USER AVATAR */}
          <img className="avatar" src={avatarUrl} alt="user" />
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="menu-toggle mobile" onClick={toggleMenu}>
          <MenuOutlined />
        </div>

        {/* MOBILE NAVIGATION */}
        {menuOpen && (
          <div className="mobile-nav">
            {TopNavLinks.map((label, index) => (
              <span className="nav-link" key={index}>
                {label}
              </span>
            ))}

            {/* MOBILE SEARCH */}
            <div className="mobile-search-container">
              <input
                type="text"
                placeholder="Search across all lists..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="mobile-search-input"
              />

              {loading ? (
                <span className="search-spinner" />
              ) : (
                <SearchOutlined className="search-icon" onClick={handleSearch} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* BREADCRUMBS */}
      <div className="bread-crumps-div">
        <Breadcrumbs />
      </div>
    </div>
  );
};

export default TopNav;
