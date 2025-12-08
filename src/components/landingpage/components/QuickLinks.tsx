import * as React from "react";
import { QuickLinkType } from "../../../utils/types";
import { useNavigate } from "react-router-dom";


interface QuickLinksProps {
  quickLinks: QuickLinkType[];
}

const QuickLinks: React.FC<QuickLinksProps> = ({ quickLinks }) => {
  const hasLinks = Array.isArray(quickLinks) && quickLinks.length > 0;
  const navigate = useNavigate();


  return (
    <div className="lp-card lp-quicklinks">
      <div className="lp-section-header">
        <h3>Quick Links</h3>
        <button
          className="lp-viewall"
          onClick={() => navigate("/listing/QuickLinks")}
        >
          View all ➜
        </button>

      </div>

      <ul className="lp-ql-list">
        {hasLinks ? (
          quickLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.tooltip}
              >
                {link.label}
              </a>
            </li>
          ))
        ) : (
          <li>No quick links available.</li>
        )}
      </ul>
    </div>
  );
};

export default QuickLinks;
