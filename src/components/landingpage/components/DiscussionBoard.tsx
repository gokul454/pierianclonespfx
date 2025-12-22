import * as React from 'react';
import { Card, Button } from 'antd';
import { DiscussionBoardType } from '../../../utils/types';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: string;
  listName: string;
  data: DiscussionBoardType;
}


const DescriptionBoard: React.FC<Props> = ({ data, listName, id }) => {

  const navigate = useNavigate()

  const handleReadMore = () => {
    navigate(`/detail/${listName}/${id}`)
  }

  return (
    <div className="description-board">
      <h3 className="board-title">Description Board</h3>
      {data ? (
        <Card className="description-card">
          <div className="description-image">
            <img src={data?.image} alt={data?.title} />
          </div>
          <div className="description-content">
            <h4 className="description-title">{data?.title}</h4>
            <p className="description-text">{data?.description}</p>
            <Button type="link" className="read-more-btn" onClick={handleReadMore}>
              Read More
            </Button>
          </div>
        </Card>
      ) : (
        <div className="upcoming-event-empty">No Description Board News.</div>
      )}
    </div>
  );
};

export default DescriptionBoard;