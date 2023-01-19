import React, { useState, useEffect } from 'react';

import "../styles/EmailBody.css"
import Spinner from './Spinner';

function EmailBody({ active, email, favorited, formatDate, handleMarkAsFavorite }) {
    const [body, setBody] = useState("")
    const [loading,setLoading ] = useState(true)
    if (!email) {
        return null
    }
    else {
        const { id, from, date, subject } = email;

        useEffect(() => {
            fetchEmailBody(id);
        }, [email]);

        const fetchEmailBody = async (id) => {
            try {
                setLoading(true)
                const response = await fetch(`https://flipkart-email-mock.vercel.app/?id=${id}`);
                const data = await response.json();
                setLoading(false)
                setBody(data.body);
            } catch (error) {
                console.error(error);
            }
        }

        return (
            <section className={`email-body ${active}`}>
                <header className="email-body__header">
                    <div className="email-body__avatar">{from.name[0].toUpperCase()}</div>
                    <h2 className="email-body__subject">{subject}</h2>
                    <button className={`email-body__favorite-button ${favorited.includes(id) ? 'favorited' : ''}`}
                        onClick={() => handleMarkAsFavorite(id)}>
                        {favorited.includes(id) ? 'Unfavorite' : 'Mark as Favorite'}
                    </button>
                </header>
                <p className="email-body__date">{formatDate(date)}</p>
                {loading && <Spinner/>}
                {!loading && <div className="email-body__body" dangerouslySetInnerHTML={{ __html: body }} ></div>}
            </section>
        );
    }
};
export default EmailBody;
