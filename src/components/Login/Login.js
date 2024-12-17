import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // React Router for navigation

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/Home');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Fetch all users from the JSON Server
      const response = await fetch("http://localhost:5000/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const users = await response.json();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
  
      if (user) {
        if (user.role === "employee") {
          navigate("/EmployeePage"); // Redirect to employee page
        } else if (user.role === "admin") {
          navigate("/AdminPage"); // Redirect to admin page
        }
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  return (
    isModalOpen && (
      // Render only if the modal is open
      <div className="login-page">
        <div className="login-modal">
          <div className="login-container">
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
            <div className="login-image">
              <img
                src="./images/home2.png" // Replace with your actual image URL
                alt="Login illustration"
              />
            </div>
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                  <label htmlFor="username">User Name</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <div className="form-options">
                  <a href="#">Forgot Password?</a>
                </div>
                <button type="submit" className="btn-login">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Login;















// import React, { useState } from 'react';
// import './Login.css';
// import { useNavigate } from 'react-router-dom'; // React Router for navigation

// const Login = () => {
  
  
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(true);
//     const navigate = useNavigate();

   
//       // Function to close the modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     navigate('/Home');  
//   };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
  
//       const apiUrl = "https://eae9-2405-201-d00a-f213-e1eb-ff57-73f5-b423.ngrok-free.app/login";
  
//       try {
//         const response = await fetch(apiUrl);
  
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
  
//         const users = await response.json();
//         const user = users.find(
//           (u) => u.username === username && u.password === password
//         );
  
//         if (user) {
//           // Successful login
//           navigate('/EmployeePage'); // Navigate to EmployeePage
//         } 

        
//           else {
//           alert("Invalid username or password");
//         }
//       } catch (error) {
//         console.error("Error logging in:", error);
//         alert("An error occurred. Please try again.");
//       }
//     };

//   return( 
      
//     isModalOpen && (
//        // Render only if the modal is open  
//     <div className="login-page">
//       <div className="login-modal">
//         <div className="login-container">
//           <button className="close-button" onClick={closeModal}>×</button>
//         <div className="login-image">
//           <img
//             src="./images/home2.png" // Replace with your actual image URL
//             alt="Login illustration"
//           />
//         </div>
//         <div className="login-form">
//           <form onSubmit={handleSubmit}>
//             <h2>Login</h2>
//             <div className="form-group">
//               <label htmlFor="username">User Name</label>
//               <input
//                 type="text"
//                 id="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Enter your username"
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//               />
//             </div>
//             <div className="form-options">
//               <a href="#">Forgot Password?</a>
//             </div>
//             <button type="submit" className="btn-login">
//               Login
//             </button>
//           </form>
//           </div>
//         </div>
//       </div>
//       </div>
    
//     )
   
//   );
// };

// export default Login;



// import React, { useState } from 'react';
// import './Login.css';
// import { useNavigate } from 'react-router-dom'; // React Router for navigation

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const navigate = useNavigate();

//   const apiUrl = "https://eae9-2405-201-d00a-f213-e1eb-ff57-73f5-b423.ngrok-free.app/login";

//   // Function to close the modal and redirect to the Login page
//   const closeModal = () => {
//     setIsModalOpen(false);
//     navigate('/Home');
//   };

//   // Function to handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // API call to fetch users
//       const response = await fetch(apiUrl);

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const users = await response.json();

//       // Check if the user exists in the database
//       const user = users.find(
//         (u) => u.username === username && u.password === password
//       );

//       if (user) {
//         // Successful login: Navigate to EmployeePage
//         navigate('/EmployeePage');
//       } else {
//         alert("Invalid username or password");
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//       alert("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     isModalOpen && ( // Render only if the modal is open
//       <div className="login-page">
//         <div className="login-modal">
//           <div className="login-container">
//             <button className="close-button" onClick={closeModal}>×</button>

//             <div className="login-image">
//               <img
//                 src="./images/home2.png" // Replace with your actual image URL
//                 alt="Login illustration"
//               />
//             </div>

//             <div className="login-form">
//               <form onSubmit={handleSubmit}>
//                 <h2>Login</h2>

//                 <div className="form-group">
//                   <label htmlFor="username">User Name</label>
//                   <input
//                     type="text"
//                     id="username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     placeholder="Enter your username"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="password">Password</label>
//                   <input
//                     type="password"
//                     id="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     required
//                   />
//                 </div>

//                 <div className="form-options">
//                   <a href="#">Forgot Password?</a>
//                 </div>

//                 <button type="submit" className="btn-login">
//                   Login
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default Login;





