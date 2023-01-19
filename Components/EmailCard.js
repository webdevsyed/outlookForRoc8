import React, { useEffect } from 'react';
import '../styles/EmailCard.css'

function EmailCard({ active, email, onClick, clicked, favorited, read, formatDate }) {
  // Function to handle clicking the card
  const handleClick = () => {
    onClick(email);
  }


  return (
    <section
      className={`email-card ${read.includes(email.id) ? 'read' : 'unread'} ${favorited.includes(email.id) ? 'favorited' : ''} ${active ? "active" : ""} ${clicked}`}
      onClick={handleClick}
    >
      <div className="email-card__avatar">{email.from.name[0].toUpperCase()}</div>
      <div className="email-card__content">
        <p className="email-card__from">From: <strong>{email.from.name} ({email.from.email})</strong></p>
        <p className="email-card__subject">Subject: <strong>{email.subject}</strong></p>
        <p className="email-card__description">{email.short_description}</p>
        <p className="email-card__date">{formatDate(email.date)}
          <span className={`email-card__${favorited.includes(email.id) ? 'favorited' : ''} ${active ? "active" : ""}`}>{favorited.includes(email.id) ? 'Favorite' : ''}</span></p>
      </div>
      {/* <div
        className={`email-card__${favorited.includes(email.id) ? 'favorited' : ''} ${active ? "active" : ""}`}>{favorited.includes(email.id) ? 'Favorite' : ''}
      </div> */}
    </section>
  );
}

export default EmailCard;
