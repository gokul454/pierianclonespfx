import * as React from "react";
import { NewJoinerType } from "../../../utils/types";
import { useNavigate } from "react-router-dom";

interface NewJoinersProps {
  newJoiners: NewJoinerType[];
}

const NewJoiners: React.FC<NewJoinersProps> = ({ newJoiners }) => {
  const hasData = Array.isArray(newJoiners) && newJoiners.length > 0;
  const navigate = useNavigate();

  // ⭐ DETAIL PAGE
  const openDetail = (id: any) => {
    if (!id) return;
    navigate(`/detail/NewJoinee/${id}`);
  };

  // ⭐ VIEW ALL
  const openList = () => {
    navigate("/listing/NewJoinee");
  };

  return (
    <div className="lp-card lp-newjoin-red lp-new-joiners">
      <div className="lp-newjoin-header">
        <h3>New Joiners</h3>

        <button className="lp-viewall" onClick={openList}>
          View all ➜
        </button>
      </div>

      {hasData ? (
        <div className="lp-newjoin-body">
          {newJoiners.map((nj) => (
            <div
              key={nj.id}
              className="lp-newjoin-item"
              onClick={() => openDetail(nj.id)}        // ⭐ CLICK ENABLED
              style={{ cursor: "pointer" }}           // ✔ No UI change but clickable
            >
              <img
                src={nj.avatar}
                alt={nj.name}
                className="lp-newjoin-avatar"
              />

              <div>
                <div className="lp-jn-name">{nj.name}</div>
                <div className="lp-jn-role">{nj.position}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="lp-newjoin-body">
          <div className="lp-jn-name">No new joiners</div>
        </div>
      )}
    </div>
  );
};

export default NewJoiners;
