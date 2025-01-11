import React, { useState, useEffect } from 'react';
import './EmployeeQuery.css';
import {jwtDecode} from 'jwt-decode';  // Import jwt-decode to decode the JWT

const EmployeeQuery = () => {
  const [message, setMessage] = useState('');
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem('authToken');

  // Decode the token to get sender_id
  const senderId = authToken ? jwtDecode(authToken).sender_id : null;

  useEffect(() => {
    if (!senderId) {
      setError('User not logged in');
      return;
    }

    // Fetch queries for the logged-in employee (sender_id)
    const fetchQueries = async () => {
      try {
        const response = await fetch(`http://localhost:5000/employee/${senderId}`, {
          headers: {
            'x-api-key': API_KEY,
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch queries');
        }

        const data = await response.json();
        setQueries(data); // Store fetched queries
      } catch (err) {
        console.error('Error fetching queries:', err);
        setError('Unable to load queries. Please try again later.');
      }
    };

    fetchQueries();
  }, [senderId, authToken]);

  const submitQuery = async () => {
    if (!senderId) {
      setError('User not logged in');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/addquery', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: senderId, // Use the decoded sender_id
          department: 'Software Development',
          question: message, // Store the message as the question
        }),
      });

      const data = await response.json();
      alert(data.message); // Alert message after submitting

      // Optionally, refetch queries to show the newly submitted query
      fetchQueries();
    } catch (err) {
      console.error('Error submitting query:', err);
      alert('Failed to submit query. Please try again later.');
    }
  };

  return (
    <div className="employee-query">
      <h1>Do you have any Query?</h1>

      {error && <p className="error-message">{error}</p>} {/* Display error if any */}
      
      <textarea
        placeholder="Write your query here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={submitQuery}>Submit</button>

      <h2>Your Previous Queries</h2>
      <ul>
        {queries.length > 0 ? (
          queries.map((query) => (
            <li key={query.id}>
              <p><strong>Question:</strong> {query.question}</p>
              <p><strong>Department:</strong> {query.department}</p>
              <p><strong>Date:</strong> {new Date(query.created_at).toLocaleString()}</p>
              <p><strong>Reply:</strong> {query.reply || 'No reply yet'}</p>
            </li>
          ))
        ) : (
          <p>No queries found.</p>
        )}
      </ul>
    </div>
  );
};

export default EmployeeQuery;
