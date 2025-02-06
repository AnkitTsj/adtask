import React from 'react';
import './ReviewCampaign.css'; // Create ReviewCampaign.css next

function ReviewCampaign({ campaignData, onModify, onLooksGood }) {
    return (
        <div className="review-campaign-container">
            <h2>Review Your Campaign</h2>
            <div className="campaign-section">
                <h3>Keywords</h3>
                <div className="data-display keywords">
                    {campaignData.keywords.map((keyword, index) => (
                        <div key={index} className="data-item">{keyword}</div>
                    ))}
                </div>
            </div>
            <div className="campaign-section">
                <h3>Headlines</h3>
                <div className="data-display headlines">
                    {campaignData.headlines.map((headline, index) => (
                        <div key={index} className="data-item">{headline}</div>
                    ))}
                </div>
            </div>
            <div className="campaign-section">
                <h3>Descriptions</h3>
                <div className="data-display descriptions">
                    {campaignData.descriptions.map((description, index) => (
                        <div key={index} className="data-item">{description}</div>
                    ))}
                </div>
            </div>
            <div className="button-container">
                <button className="modify-button" onClick={onModify}>Modify</button>
                <button className="looks-good-button" onClick={onLooksGood}>Looks Good</button>
            </div>
        </div>
    );
}

export default ReviewCampaign;