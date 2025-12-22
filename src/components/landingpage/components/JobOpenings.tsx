import * as React from "react"
import { useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { dateFormat } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';

interface JobOpening {
  id: string;
  title: string;
  experience: string;
  dateposted: string;
  location: string;
  description?: string;
}

interface JobOpeningsProps {
  jobOpenings: JobOpening[];
  onViewAll?: () => void;
}

const JobOpenings: React.FC<JobOpeningsProps> = ({ jobOpenings,onViewAll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentJob = jobOpenings[currentIndex];
  const navigate = useNavigate();
  const handleClick = (id: any) => {
        navigate(`/detail/JobOpenings/${id}`);
    };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + jobOpenings.length) % jobOpenings.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % jobOpenings.length);
  };

  const handleViewAllNews = () => {
    console.log('Navigate to all news page');
      if (onViewAll) {
            onViewAll();
        }
   
  };

  return (
    <div className="job-openings-container">
      <div className="job-openings-header">
        <h3>Job Openings</h3>
        <Button type="link" className="lp-job-view-all-btn white-link" onClick={handleViewAllNews}>
          View all <RightOutlined style={{color:'white'}}/>
        </Button>
      </div>
      {jobOpenings.length > 0 ? (
        <>
          <div className="job-openings-list">
            <div className="job-openings-item" onClick={() => handleClick(currentJob.id)}>
              <div className="job-openings-info">
                <h4 className="job-openings-title">{currentJob.title}</h4>
                <p className="job-openings-experience">Experience: {currentJob.experience}</p>
                <p className="job-openings-location">Location: {currentJob.location}</p>
                <p className="job-openings-location">Date posted: {dateFormat(currentJob.dateposted)}</p>
                {/* {currentJob.description && (
                  <p className="job-openings-description">{currentJob.description}</p>
                )} */}
              </div>
            </div>
          </div>
          <div className="job-openings-nav">
            <button className="job-openings-nav-btn" onClick={handlePrev}>
              <LeftOutlined style={{ color: 'white' }}/>
            </button>
            <button className="job-openings-nav-btn" onClick={handleNext}>
              <RightOutlined style={{ color: 'white' }}/>
            </button>
          </div>
        </>
      ) : (
        <div className="job-openings-empty">No Job Openings.</div>
      )}
    </div>
  );
};

export default JobOpenings