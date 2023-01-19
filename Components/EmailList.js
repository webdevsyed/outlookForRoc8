import React, { useState, useEffect } from 'react';
import EmailCard from './EmailCard';
import EmailBody from './EmailBody';
import Pagination from './Pagination'
import '../styles/EmailList.css'
import Spinner from './Spinner';

function EmailList() {
    const [emails, setEmails] = useState([]);
    const [filteredEmails, setFilteredEmails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)
    const [favorited, setFavorited] = useState([]);
    const [readStatus, setReadStatus] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [active, setActive] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [loading, setLoading] = useState(true)


    // Function to handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // Function to handle date formatting
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    useEffect(() => {
        fetchEmails(currentPage);
        checkFavoritedandRead()
        console.log(document.getElementsByClassName("selected").length===0?"all":document.getElementsByClassName("selected")[0].id)
    }, [currentPage]);

    // Function to fetch emails accd to page num
    const fetchEmails = async (page) => {
        try {
            setLoading(true)
            const response = await fetch(`https://flipkart-email-mock.now.sh/?page=${page}`);
            const data = await response.json();
            setEmails(data.list);
            setFilteredEmails(data.list)
            setLoading(false)
            setTotalPages(data.total)

        } catch (error) {
            console.error(error);
        }
    }

    // Function to retreive favorited and rad email arrays from local storage, or initiate them if they arent present
    const checkFavoritedandRead = () => {
        if (localStorage.getItem('favoritedEmailsIdsArray') === null) {
            localStorage.setItem('favoritedEmailsIdsArray', "[]")
        } else {
            setFavorited(JSON.parse(localStorage.getItem("favoritedEmailsIdsArray")))
        }
        if (localStorage.getItem('readEmailsIdsArray') === null) {
            localStorage.setItem('readEmailsIdsArray', "[]")
        } else {
            setReadStatus(JSON.parse(localStorage.getItem("readEmailsIdsArray")))
        }
    }


    // Function to handle selecting an email
    const handleSelectEmail = (email, id) => {
        setSelectedEmail(email);
        if (selectedEmail === null) {
            setActive(true)
        }
        else {
            if (active === false) {
                setActive(true)
            } else {
                id === selectedEmail.id ? setActive(false) : setActive(true)
            }
        }
        updateReadStatus(email.id)
    }

    // Function to update Array containing list of ids of read emails
    const updateReadStatus = (id) => {
        const readEmailsIdsArray = JSON.parse(localStorage.getItem('readEmailsIdsArray'))
        if (!readEmailsIdsArray.includes(id)) {
            readEmailsIdsArray.unshift(id)
            setReadStatus(readEmailsIdsArray)
        }
        localStorage.setItem('readEmailsIdsArray', JSON.stringify(readEmailsIdsArray));
    }

    // Function to handle favoriting an email 
    const handleMarkAsFavorite = (id) => {
        if (localStorage.getItem('favoritedEmailsIdsArray')) {
            const favoritedEmailsIdsArray = JSON.parse(localStorage.getItem('favoritedEmailsIdsArray'))
            if (favoritedEmailsIdsArray.includes(id)) {
                emailIndex = favoritedEmailsIdsArray.findIndex((item) => item === id)
                favoritedEmailsIdsArray.splice(emailIndex, 1)
                setFavorited(favoritedEmailsIdsArray)
            }
            else {
                favoritedEmailsIdsArray.unshift(id)
                setFavorited(favoritedEmailsIdsArray)
            }
            localStorage.setItem('favoritedEmailsIdsArray', JSON.stringify(favoritedEmailsIdsArray));
        } else {
            localStorage.setItem('favoritedEmailsIdsArray', JSON.stringify([id]))
            setFavorited([id])
        }
    }

    // Function to handle selecting and deselecting filter buttons    
    const handleFilterClick = (filter) => {
        if (selectedFilter === filter) {
            setSelectedFilter("all");
            filterMails("all")
        } else {
            setSelectedFilter(filter);
            filterMails(filter)
        }
    }

    // Function to update filtered emails as per selected filter
    const filterMails = (filter) => {
        const filteredEmails = emails.filter(email => {
            if (filter === "all") {
                return true
            }
            else {
                if (filter === "favorite" && favorited.includes(email.id)) {
                    return true;
                }
                if (filter === "read" && readStatus.includes(email.id)) {
                    return true;
                }
                if (filter === "unread" && !readStatus.includes(email.id)) {
                    return true;
                }
                return false;
            }
        })
        setFilteredEmails(filteredEmails)
    }

    return (
        <div className="container">
            <section className={`filter ${active ? "active" : ""}`}>
                <p>Filter by :</p>
                <button
                    id="read"
                    className={`filter-button ${selectedFilter === "read" ? "selected" : ""}`}
                    onClick={() => handleFilterClick("read")}
                >Read</button>
                <button
                  id="unread"
                    className={`filter-button ${selectedFilter === "unread" ? "selected" : ""}`}
                    onClick={() => handleFilterClick("unread")}
                >Unread</button>
                <button
                    id="favorite"
                    className={`filter-button ${selectedFilter === "favorite" ? "selected" : ""}`}
                    onClick={() => handleFilterClick("favorite")}
                >Favorite</button>
            </section>
            <section className={`menu ${active ? "active" : ""}`}>
                <button className='menu__button' onClick={() => setActive(false)}>Back</button>
            </section>
            {loading && <Spinner />}
            <div className="email-list">

                {!loading && filteredEmails.map((email) => (
                    <EmailCard
                        active={active}
                        key={email.id}
                        email={email}
                        onClick={() => handleSelectEmail(email, email.id)}
                        clicked={selectedEmail && selectedEmail.id === email.id ? "clicked" : ""}
                        favorited={favorited}
                        read={readStatus}
                        handleMarkAsFavorite={handleMarkAsFavorite}
                        formatDate={formatDate}
                    />
                ))}
                {selectedEmail && <EmailBody
                    active={active ? "active" : ""}
                    email={selectedEmail}
                    favorited={favorited}
                    formatDate={formatDate}
                    handleMarkAsFavorite={handleMarkAsFavorite}
                />}
                    
            </div>
     
            <Pagination
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                totalPages={totalPages}
            />
        </div>

    )
}
export default EmailList;
