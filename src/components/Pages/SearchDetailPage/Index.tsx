import * as React from "react";
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SPFI } from '@pnp/sp';
import './SearchDetailPage.css';
import { spContext } from '../../../App';
import { dateFormat } from '../../../utils/utils';

interface SearchResultItem {
    Id: number;
    Title: string;
    Description?: string;
    Date?: string;
    Image?: string;
    [key: string]: any;
}

const listFieldSelector: Record<string, string[]> = {
    CorporateNews: ['Id', 'Title', 'Description', 'Date', 'Image', 'Status'],
    CorporateEvents: ['Id', 'Title', 'Description', 'Date', 'Image', 'Status'],
    DiscussionBoard: ['Id', 'Title', 'Description', 'Image', 'Status'],
    MediaGallery: ['Id', 'Title', 'Description', 'ThumbnailURL', 'MediaType', 'LinkURL', 'Status'],
    JobOpenings: ['Id', 'jobTitle', 'JobDescription', 'experience', 'location', 'DatePosted', 'Status'],
    HRAnnouncements: ['Title', 'Description', 'Status'],
    LeadershipMessage: ['Id', 'Title', 'EmployeeName', 'Designation', 'Message', 'UserImage', 'Status'],
    LatestNewsAndEvents: ['Id', 'Title', 'Description', 'Date', 'PublishType', 'Image'],
    EmployeeDirectory: [
        'IsActive', 'UserID', 'EmployeeName', 'EmailID', 'DateofBirth', 'DateofJoining',
        'Department', 'ReportingManager', 'Designation', 'JobLocation', 'ProfilePicture1',
        'Mobile', 'Phone', 'Status'
    ],
    Default: ['Id', 'Title', 'Description', 'Date', 'Image'],
};

const getFieldsForList = (listName: string): string[] => {
    return listFieldSelector[listName] || listFieldSelector.Default;
};

const normalizeItem = (item: any, listName: string): SearchResultItem => {
    switch (listName) {
        case 'MediaGallery':
            return {
                Id: item.Id,
                Title: item.Title,
                Description: item.Description,
                Image: item.ThumbnailURL,
                Date: '',
            };
        case 'JobOpenings':
            return {
                Id: item.Id,
                Title: item.jobTitle,
                Description: item.JobDescription,
                Date: item.DatePosted,
                Image: '',
            };
        case 'LeadershipMessage':
            return {
                Id: item.Id,
                Title: item.Title,
                Description: item.Message,
                Date: '',
                Image: item.UserImage,
            };
        case 'EmployeeDirectory':
            return {
                Id: item.UserID || item.Id,
                Title: item.EmployeeName,
                Description: item.Designation,
                Date: item.DateofJoining,
                Image: item.ProfilePicture1,
            };
        case 'HRAnnouncements':
            return {
                Id: item.Id || Math.random(),
                Title: item.Title,
                Description: item.Description,
                Date: '',
                Image: '',
            };
        default:
            return {
                Id: item.Id,
                Title: item.Title,
                Description: item.Description,
                Date: item.Date,
                Image: item.Image,
            };
    }
};

const getListItems = async (
    sp: SPFI,
    listName: string,
    filterText?: string,
    id?: string,
    top?: number
): Promise<any[]> => {
    try {
        const fields = getFieldsForList(listName);

        const list = sp.web.lists.getByTitle(listName);

        if (id) {
            const item = await list.items.getById(Number(id)).select(...fields)();
            return [item]; // wrap in array for consistent return type
        }

        let query = list.items.select(...fields);
        const hasStatus = fields.includes("Status");

        const filters: string[] = [];

        if (filterText) {
            filters.push(`substringof('${filterText}', Title)`);
        }

        if (hasStatus) {
            filters.push(`Status eq 'publish'`);
        }

        if (filters.length > 0) {
            query = query.filter(filters.join(" and "));
        }

        if (top) {
            query = query.top(top);
        }

        return await query();
    } catch (err) {
        console.error(`Error fetching list items from ${listName}`, err);
        return [];
    }
};

const SearchDetailPage: React.FC = () => {
    const { sp } = useContext(spContext);
    const { listName, id: searchTextParam } = useParams<{ listName: string; id?: string }>();

    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!listName) return;

            setIsLoading(true);
            const items = await getListItems(sp, listName, searchTextParam, searchTextParam); // id passed
            const normalized = items.map(item => normalizeItem(item, listName));
            setResults(normalized);
            setIsLoading(false);
        };

        fetchResults();
    }, [listName, searchTextParam]);

    return (
        <div className="search-detail-container">
            {isLoading ? (
                <div className="search-detail-loading">Loading...</div>
            ) : results.length === 0 ? (
                <div className="search-detail-empty">No results found</div>
            ) : (
                <div className="search-detail-cards-wrapper">
                    <div className="search-detail-row">
                        {results.map((item) => (
                            <div className="search-detail-col" key={item.Id}>
                                <div className="search-detail-card">
                                    <h3 className="search-detail-card-title">{item.Title}</h3>
                                    {item.Image && (
                                        <img
                                            src={item.Image}
                                            alt={item.Title}
                                            className="search-detail-card-image"
                                        />
                                    )}
                                    {item.Description && (
                                        <p className="search-detail-card-description">{item.Description}</p>
                                    )}
                                    {item.Date && (
                                        <div className="search-detail-card-footer">
                                            <span className="search-detail-card-date">
                                                Date: {dateFormat(item.Date)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchDetailPage;
