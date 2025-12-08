import * as React from "react";
import { RecognizedEmployeeType } from "../../../utils/types";
import { useNavigate } from "react-router-dom";

interface RecognizedEmployeesProps {
  data: RecognizedEmployeeType[];
}

const RecognizedEmployees: React.FC<RecognizedEmployeesProps> = ({ data }) => {
  const hasData = Array.isArray(data) && data.length > 0;

  const navigate = useNavigate();

  // ⭐ navigate to detail page
  const openDetail = (id: any) => {
    if (!id) return;
    navigate(`/detail/RecogonizedEmployee/${id}`);
  };

  return (
    <div className="lp-card lp-recognized">
      <div className="lp-rec-head">
        <h3>Recognized Employees</h3>
        <button
          className="View-all-red small"
          onClick={() => navigate("/listing/RecogonizedEmployee")}
        >
          View all ➜
        </button>
      </div>

      <ul className="lp-rec-list">
        {hasData ? (
          data.map((emp) => (
            <li
              key={emp.id}
              onClick={() => openDetail(emp.id)}     // ⭐ CLICK HANDLER ADDED
              style={{ cursor: "pointer" }}          // ← Doesn't change UI look, just gives usability
            >
              <img
                src={emp.avatar}
                alt={emp.name}
                className="lp-rec-thumb"
              />

              <div>
                <div className="lp-rec-name">{emp.name}</div>
                <div className="lp-rec-role">
                  {emp.position} {emp.department ? `— ${emp.department}` : ""}
                </div>
              </div>

              <div className="lp-rec-date">{emp.recognition}</div>
            </li>
          ))
        ) : (
          <li>
            <div className="lp-rec-name">No recognized employees available</div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default RecognizedEmployees;
