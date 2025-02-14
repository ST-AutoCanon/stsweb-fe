import React, { useState, useEffect } from 'react';
import './EmployeeQuery.css';

const EmployeeQueries = () => {
  const [message, setMessage] = useState('');
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem('authToken');
  const employeeData = JSON.parse(localStorage.getItem('dashboardData'));
  const senderId = employeeData?.employeeId;
  const departmentId = employeeData?.department_id;
  const recipientId = 'ADM001'; // Example recipient (Admin ID); replace with dynamic logic if needed.

  // Fetch threads from the server
  const fetchThreads = async () => {
    if (!senderId) {
      setError('User not logged in');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/threads`, {
        headers: {
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }

      const data = await response.json();
      setThreads(data.data || []); // Adjust based on the API response structure
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError('Unable to load threads. Please try again later.');
    }
  };

  // Start a new thread
  const startThread = async () => {
    if (!senderId || !departmentId || !message) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/threads', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: senderId,
          recipient_id: recipientId,
          department_id: departmentId,
          question: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start thread');
      }

      const data = await response.json();
      alert(data.message); // Alert success message
      setMessage(''); // Clear the input field
      fetchThreads(); // Refetch threads to update the list
    } catch (err) {
      console.error('Error starting thread:', err);
      alert('Failed to start thread. Please try again later.');
    }
  };

  // Add a message to an existing thread
  const addMessage = async (threadId) => {
    if (!senderId || !message) {
      setError('Message cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
          sender_id: senderId,
          sender_role: 'employee', // This could be dynamic, but it's hardcoded for now
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add message');
      }

      const data = await response.json();
      alert(data.message); // Alert success message
      setMessage(''); // Clear the input field
      fetchThreads(); // Refetch threads to update the list
    } catch (err) {
      console.error('Error adding message:', err);
      alert('Failed to add message. Please try again later.');
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [senderId]); // Re-fetch threads if senderId changes

  return (
    <div className="employee-query">
      <h1>Do you have any Query?</h1>

      {error && <p className="error-message">{error}</p>}

      <textarea
        placeholder="Write your query here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={startThread}>Start Thread</button>

      <h2>Your Threads</h2>
      <ul>
        {threads.length > 0 ? (
          threads.map((thread) => (
            <li key={thread.thread_id}>
              <p><strong>Thread ID:</strong> {thread.thread_id}</p>
              <p><strong>Last Message:</strong> {thread.last_message || 'No messages yet'}</p>
              <p><strong>Status:</strong> {thread.status}</p>
              <p><strong>Feedback:</strong> {thread.feedback || 'No feedback given'}</p>
              
              <textarea
                placeholder="Add a message to this thread..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <button onClick={() => addMessage(thread.thread_id)}>Reply</button>
            </li>
          ))
        ) : (
          <p>No threads found.</p>
        )}
      </ul>
    </div>
  );
};

export default EmployeeQueries;
