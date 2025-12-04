import * as React from "react";
import { useState, useEffect } from "react";
import { WelcomeMessageType } from "../../../utils/types";


interface WelcomeOnboardProps {
  data: WelcomeMessageType[];
}

const WelcomeOnboard: React.FC<WelcomeOnboardProps> = ({ data }) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const [index, setIndex] = useState(0);

  // Keep index valid if data updates
  useEffect(() => {
    if (!hasData) {
      setIndex(0);
    } else if (index >= data.length) {
      setIndex(0);
    }
  }, [data, index, hasData]);

  // slider navigation logic (same as LeadershipMessage)
  const prev = () => {
    if (hasData) {
      setIndex((prev) => (prev - 1 + data.length) % data.length);
    }
  };

  const next = () => {
    if (hasData) {
      setIndex((prev) => (prev + 1) % data.length);
    }
  };

  const current = hasData ? data[index] : null;

  if (!hasData) {
    return (
      <div className="lp-card lp-welcome">
        <div>
          <div className="lp-welcome-sub">We're excited to have you with us</div>
          <div className="lp-welcome-main">
            Welcome on board,<strong>New Employee</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lp-card lp-welcome">
      <div>
        <div className="lp-welcome-sub">{current?.message}</div>

        <div className="lp-welcome-main">
          Welcome on board, <strong>{current?.employeeName}</strong>
        </div>
      </div>

      <img
        src={current?.employeeImage}
        alt={current?.employeeName}
        className="lp-welcome-thumb"
      />

      {/* Slider Buttons (same style logic as LeadershipMessage) */}
      <div className="lp-lead-nav">
        <button className="lp-circle small" onClick={prev}>◀</button>
        <button className="lp-circle small" onClick={next}>▶</button>
      </div>
    </div>
  );
};

export default WelcomeOnboard;
