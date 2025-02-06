// import React, { useState, useEffect, useRef } from 'react';
// import './App.css';
// import ReviewCampaign from './ReviewCampaign';
// import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; // Import Router, Route, Routes, useNavigate


// function App() {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const [backendMessage, setBackendMessage] = useState('');
//     const [isReviewMode, setIsReviewMode] = useState(false);
//     const [campaignData, setCampaignData] = useState(null);
//     const [googleAuthUrl, setGoogleAuthUrl] = useState(null);
//     const messagesEndRef = useRef(null);
//     const navigate = useNavigate(); // Hook for programmatic navigation


//     useEffect(() => {
//         fetch('http://localhost:5000/api/hello')
//             .then(response => response.json())
//             .then(data => {
//                 setBackendMessage(data.message);
//             })
//             .catch(error => {
//                 console.error("Error fetching from backend:", error);
//                 setBackendMessage("Failed to connect to backend.");
//             });

//         fetch('http://localhost:5000/api/auth/google-ads-url')
//             .then(response => response.json())
//             .then(data => {
//                 setGoogleAuthUrl(data.authUrl);
//             })
//             .catch(error => {
//                 console.error("Error fetching Google Ads auth URL:", error);
//             });

//         // Check URL for "code" parameter on component mount
//         const urlParams = new URLSearchParams(window.location.search);
//         const code = urlParams.get('code');
//         if (code) {
//             // If "code" parameter is present (OAuth callback), redirect to chat
//             console.log("OAuth 2.0 Authorization Code received:", code);
//             navigate('/oauthsuccess'); // Programmatically navigate to /oauthsuccess route
//         }

//     }, [navigate]);


//     useEffect(() => {
//         const scrollToBottom = () => {
//             messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         };
//         scrollToBottom();
//     }, [messages]);



//     const sendMessage = (event) => {
//         event.preventDefault();
//         const userMessage = input.trim();
//         if (userMessage) {
//             const newUserMessage = { text: userMessage, sender: 'user' };
//             setMessages(currentMessages => [...currentMessages, newUserMessage]);
//             setInput('');

//             fetch('http://localhost:5000/api/chatbot', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ message: userMessage })
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.isReview) { // Check if backend sent a review response
//                         setIsReviewMode(true);
//                         setCampaignData(data.campaignData);
//                     } else {
//                         const botResponse = data.response;
//                         const newBotMessage = { text: botResponse, sender: 'bot' };
//                         setMessages(currentMessages => [...currentMessages, newBotMessage]);
//                     }
//                 })
//                 .catch(error => {
//                     console.error("Error sending message to backend:", error);
//                     setMessages(currentMessages => [...currentMessages, { text: "Error getting bot response.", sender: 'bot' }]);
//                 });
//         }
//     };

//     const handleModifyClick = () => {
//         setIsReviewMode(false);
//         setCampaignData(null);
//     };

//     const handleLooksGoodClick = () => {
//         alert("Looks Good! (Future: In a real application, this would now send the campaign data to the Google Ads API to create the actual campaign.)\n\nFor this MVP demo, check the browser's developer console (F12, Console tab) to see the generated campaign data that would be sent to the Google Ads API.");
//         console.log("Campaign Data (Looks Good Clicked):", campaignData);
//     };


//     const openGoogleAdsAuth = () => {
//         if (googleAuthUrl) {
//             window.location.href = googleAuthUrl;
//         } else {
//             alert("Authorization URL not yet loaded.");
//         }
//     };


//     return (
//         <div className="App">
//             <header className="App-header">
//                 <h1>AI Chatbot for Google Ads</h1>
//                 <p>Backend says: {backendMessage}</p>
//                 <button onClick={openGoogleAdsAuth} disabled={!googleAuthUrl}>
//                     Authorize Google Ads
//                 </button>
//             </header>
//             <main className="chat-container">
//                 <Routes>
//                     <Route path="/" element={
//                         !isReviewMode ? (
//                             <>
//                                 <div className="message-area">
//                                     {messages.map((message, index) => (
//                                         <div key={index} className={`message ${message.sender}`} key={index}>
//                                             {message.text}
//                                         </div>
//                                     ))}
//                                     <div ref={messagesEndRef} />
//                                 </div>
//                                 <form onSubmit={sendMessage} className="input-area"> {/* **FORM TAG - CORRECTLY CLOSED NOW** */}
//                                     <input
//                                         type="text"
//                                         placeholder="Type your message..."
//                                         value={input}
//                                         onChange={(e) => setInput(e.target.value)}
//                                     />
//                                     <button type="submit">Send</button>
//                                 </form> {/* **FORM TAG - CORRECTLY CLOSED NOW** */}
//                             </>
//                         ) : (
//                             <ReviewCampaign
//                                 campaignData={campaignData}
//                                 onModify={handleModifyClick}
//                                 onLooksGood={handleLooksGoodClick}
//                             />
//                         )
//                     } />
//                      <Route path="/oauthsuccess" element={<div>OAuth 2.0 Authorization Successful! You can now use the chatbot.</div>} />
//                 </Routes>
//             </main>
//         </div>
//     );
// }


// function RootApp() {
//     return (
//         <Router>
//             <App />
//         </Router>
//     );
// }

// export default RootApp;


import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ReviewCampaign from './ReviewCampaign';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [backendMessage, setBackendMessage] = useState('');
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [campaignData, setCampaignData] = useState(null);
    const [googleAuthUrl, setGoogleAuthUrl] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/hello')
            .then(response => response.json())
            .then(data => {
                setBackendMessage(data.message);
            })
            .catch(error => {
                console.error("Error fetching from backend:", error);
                setBackendMessage("Failed to connect to backend.");
            });

        fetch('http://localhost:5000/api/auth/google-ads-url')
            .then(response => response.json())
            .then(data => {
                setGoogleAuthUrl(data.authUrl);
            })
            .catch(error => {
                console.error("Error fetching Google Ads auth URL:", error);
            });

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            console.log("OAuth 2.0 Authorization Code received:", code);
            navigate('/oauthsuccess');
        }

    }, [navigate]);

    useEffect(() => {
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        };
        scrollToBottom();
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        const userMessage = input.trim();
        if (userMessage) {
            const newUserMessage = { text: userMessage, sender: 'user' };
            setMessages(currentMessages => [...currentMessages, newUserMessage]);
            setInput('');

            fetch('http://localhost:5000/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.isReview) {
                        setIsReviewMode(true);
                        setCampaignData(data.campaignData);
                    } else {
                        const botResponse = data.response;
                        const newBotMessage = { text: botResponse, sender: 'bot' };
                        setMessages(currentMessages => [...currentMessages, newBotMessage]);
                    }
                })
                .catch(error => {
                    console.error("Error sending message to backend:", error);
                    setMessages(currentMessages => [...currentMessages, { text: "Error getting bot response.", sender: 'bot' }]);
                });
        }
    };

    const handleModifyClick = () => {
        setIsReviewMode(false);
        setCampaignData(null);
    };

    const handleLooksGoodClick = () => {
        alert("Looks Good! (Future: In a real application, this would now send the campaign data to the Google Ads API to create the actual campaign.)\n\nFor this MVP demo, check the browser's developer console (F12, Console tab) to see the generated campaign data that would be sent to the Google Ads API.");
        console.log("Campaign Data (Looks Good Clicked):", campaignData);
    };

    const handleTestGoogleAdsApi = () => { // Function to call test API endpoint
        fetch('http://localhost:5000/api/test-google-ads-api')
            .then(response => response.json())
            .then(data => {
                alert("Google Ads API Test Response (check console):\n" + data.message);
                console.log("Google Ads API Test Response Data:", data.apiResponse);
            })
            .catch(error => {
                console.error("Error calling /api/test-google-ads-api:", error);
                alert("Error testing Google Ads API. Check console.");
            });
    };


    const openGoogleAdsAuth = () => {
        if (googleAuthUrl) {
            window.location.href = googleAuthUrl;
        } else {
            alert("Authorization URL not yet loaded.");
        }
    };


    return (
        <div className="App">
            <header className="App-header">
                <h1>AI Chatbot for Google Ads</h1>
                <p>Backend says: {backendMessage}</p>
                <button onClick={openGoogleAdsAuth} disabled={!googleAuthUrl}>
                    Authorize Google Ads
                </button>
                {/* New button to test Google Ads API - **ADDED BUTTON HERE** */}
                <button onClick={handleTestGoogleAdsApi}>
                    Test Google Ads API
                </button>
            </header>
            <main className="chat-container">
                <Routes>
                    <Route path="/" element={
                        !isReviewMode ? (
                            <>
                                <div className="message-area">
                                    {messages.map((message, index) => (
                                        <div key={index} className={`message ${message.sender}`} key={index}>
                                            {message.text}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={sendMessage} className="input-area">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    <button type="submit">Send</button>
                                </form>
                            </>
                        ) : (
                            <ReviewCampaign
                                campaignData={campaignData}
                                onModify={handleModifyClick}
                                onLooksGood={handleLooksGoodClick}
                            />
                        )
                    } />
                     <Route path="/oauthsuccess" element={<div>OAuth 2.0 Authorization Successful! You can now use the chatbot.</div>} />
                </Routes>
            </main>
        </div>
    );
}


function RootApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default RootApp;