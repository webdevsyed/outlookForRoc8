import React, { useState, useEffect } from 'react';
import EmailBody from './EmailBody';
import Pagination from './Pagination'
import '../styles/EmailList.css'

function EmailList() {
    const [emails, setEmails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmailId, setSelectedEmailId] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [isFavorited, setIsFavorited] = useState(false);

    const handleMarkAsFavorite = () => {
        setIsFavorited(!isFavorited);
      }
    useEffect(() => {
        fetchEmails(currentPage);
    }, [currentPage]);


    const fetchEmails = async (page) => {
        try {
            const response = await fetch(`https://flipkart-email-mock.now.sh/?page=${page}`);
            const data = await response.json();
            setEmails(data.list);
        } catch (error) {
            console.error(error);
        }
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    }

    const handleEmailSelect = (emailId, subject, date, name) => {
        setSelectedEmailId(emailId);
        setSelectedSubject(subject);
        setSelectedDate(date);
        setSelectedName(name);
    }



return (
    <div>
        <div className="card-container">
            {emails.map((email) => (
                <div key={email.id} className={`card ${email.id === selectedEmailId ? 'selected' : ''} ${email.isFavorited ? 'favorited' : ''} ${email.isRead ? 'read' : 'unread'}`} onClick={() => handleEmailSelect(email.id, email.subject, email.date, email.from.name)}>
                    <div className="card-header">
                        <div className="avatar-container">
                            <div className="avatar" style={{ backgroundColor: '#87CEEB' }}>{email.from.name[0]}</div>
                        </div>
                        <div>From: {email.from.name} ({email.from.email})</div>
                        <div>Subject: {email.subject}</div>
                        <div>{email.short_description}</div>
                        <div>{email.date}</div>
                        {email.isFavorited && <div className="favorited-indicator">Favorited</div>}
                    </div>
                </div>
            ))}
        </div>

        <Pagination
            currentPage={currentPage}
            handlePageChange={handlePageChange}
        />

        {
            selectedEmailId &&
            <EmailBody
                emailId={selectedEmailId}
                subject={selectedSubject}
                date={selectedDate}
                name={selectedName}
                handleMarkAsFavorite={handleMarkAsFavorite}
            />
        }
    </div >
);

    }
export default EmailList;