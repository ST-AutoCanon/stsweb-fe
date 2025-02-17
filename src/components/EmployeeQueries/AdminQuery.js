import React, { useState, useEffect } from 'react';
import './AdminQuery.css';

const AdminQuery = () => {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState('');
  const [replyingQueryId, setReplyingQueryId] = useState(null); // Track which query is being replied to

  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch('http://122.166.77.12:5000/all', {
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
        setQueries(data.data || []); // Use data.data if your API wraps data in this format
      } catch (err) {
        console.error('Error fetching queries:', err);
        setError('Unable to load queries. Please try again later.');
      }
    };

    fetchQueries();
  }, []);

  // Function to handle reply submission
  const handleReplySubmit = async () => {
    try {
      const response = await fetch(`http://122.166.77.12:5000/adminreply`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: replyingQueryId, reply }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }

      // Update the query with the new reply
      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query.id === replyingQueryId ? { ...query, reply } : query
        )
      );

      // Reset the reply input and replyingQueryId after submission
      setReply('');
      setReplyingQueryId(null);
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError('Unable to submit reply. Please try again later.');
    }
  };

  return (
    <div className="admin-query">
      <h2>Employee Queries</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Query ID</th>
              <th>Sender ID</th>
              <th>Department</th>
              <th>Question</th>
              <th>Reply</th>
              <th>Date & Time</th>
              <th>Action</th> {/* Added a column for the reply button */}
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr key={query.id}>
                <td>{query.id}</td>
                <td>{query.sender_id}</td>
                <td>{query.department}</td>
                <td>{query.question}</td>
                <td>{query.reply || 'No reply yet'}</td>
                <td>{new Date(query.created_at).toLocaleString()}</td>
                <td>
                  {query.reply ? (
                    'Already replied'
                  ) : (
                    <button
                      onClick={() => setReplyingQueryId(query.id)} // Show text box when clicked
                    >
                      Reply
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {replyingQueryId && (
        <div className="reply-box">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your reply here..."
          />
          <button onClick={handleReplySubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default AdminQuery;

