import * as React from "react";
import { useState } from "react";
import { RecognizedEmployeeType } from "../../../utils/types";
import { useNavigate } from "react-router-dom";

interface RecognizedEmployeesProps {
  data: RecognizedEmployeeType[];
}

const RecognizedEmployees: React.FC<RecognizedEmployeesProps> = ({ data }) => {
  const navigate = useNavigate();
  const hasData = Array.isArray(data) && data.length > 0;

  const [activeIndex, setActiveIndex] = useState(0);

  const openDetail = (id: any) => {
    if (!id) return;
    navigate(`/detail/RecogonizedEmployee/${id}`);
  };

  const prev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? data.length - 1 : prev - 1
    );
  };

  const next = () => {
    setActiveIndex((prev) =>
      prev === data.length - 1 ? 0 : prev + 1
    );
  };

  const activeEmployee = hasData ? data[activeIndex] : null;

  return (
    <div className="lp-card lp-recognized">
      {/* Header */}
      <div className="lp-rec-head">
        <h3>Recognized Employees</h3>

        <div className="lp-rec-actions">
          <button className="lp-circle small" onClick={prev}>
            ‹
          </button>
          <button className="lp-circle small" onClick={next}>
            ›
          </button>
        </div>
      </div>

      {/* Carousel Body */}
      {activeEmployee ? (
        <div
          className="lp-rec-carousel"
          onClick={() => openDetail(activeEmployee.id)}
          style={{ cursor: "pointer" }}
        >
          <div className="lp-rec-profile">
            <img
              src={activeEmployee.avatar}
              alt={activeEmployee.name}
              className="lp-rec-thumb"
            />

            <div>
              <div className="lp-rec-name">{activeEmployee.name}</div>
              <div className="lp-rec-role">
                {activeEmployee.position}
                {activeEmployee.department
                  ? ` — ${activeEmployee.department}`
                  : ""}
              </div>
            </div>
          </div>

          <div className="lp-rec-description">
            {activeEmployee.recognition}
          </div>
        </div>
      ) : (
        <div className="lp-rec-empty">
          No recognized employees available
        </div>
      )}

      {/* Footer */}
      {/* <div className="lp-rec-footer">
        <button
          className="View-all-red small"
          onClick={() => navigate("/listing/RecogonizedEmployee")}
        >
          View all ➜
        </button>
      </div> */}
    </div>
  );
};

export default RecognizedEmployees;
