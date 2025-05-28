
// // import React, { useEffect, useState } from 'react';
// // import './EmployeeLogin.css';
// // import { Eye } from 'lucide-react';
// // import axios from 'axios';

// // const EmployeeCardWithHover = ({ employeePunches }) => {
// // const [hovered, setHovered] = useState(false);
// // const [avatar, setAvatar] = useState('/default-profile.jpg'); // Default avatar
// // const meId = JSON.parse(
// //     localStorage.getItem("dashboardData") || "{}"
// //   ).employeeId;
// //   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
// //   // Validate employeePunches
// //   if (!employeePunches || !Array.isArray(employeePunches) || employeePunches.length === 0) {
// //     return <div className="employee-card-hover">No punch data available</div>;
// //   }

// //   // Get first punch-in and latest punch-out
// //   const sortedByPunchIn = [...employeePunches].sort(
// //     (a, b) => new Date(a.punchin_time) - new Date(b.punchin_time)
// //   );
// //   const firstPunchIn = sortedByPunchIn[0]?.punchin_time;

// //   const validPunchOuts = employeePunches.filter((p) => p.punchout_time);
// //   const sortedByPunchOut = [...validPunchOuts].sort(
// //     (a, b) => new Date(b.punchout_time) - new Date(a.punchout_time)
// //   );
// //   const latestPunchOut = sortedByPunchOut[0]?.punchout_time;

// //   const latest = employeePunches[employeePunches.length - 1];
// //   const name = `${latest.first_name || 'Unknown'} ${latest.last_name || ''}`.trim();
// //   const photoUrl = latest.photo_url || null;
// //   const API_KEY = process.env.REACT_APP_API_KEY;

// //   // Determine card color based on latest location
// //   const isOfficeHQ =
// //     (latest.punchin_location && typeof latest.punchin_location === 'string' &&
// //      latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
// //     (latest.punchout_location && typeof latest.punchout_location === 'string' &&
// //      latest.punchout_location.trim().toLowerCase().includes('office hq'));
// //     console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
// //     punchin_location: latest.punchin_location,
// //     punchout_location: latest.punchout_location,
// //     punchin_type: typeof latest.punchin_location,
// //     punchout_type: typeof latest.punchout_location,
// //     punchin_raw: latest.punchin_location?.trim(),
// //     punchout_raw: latest.punchout_location?.trim(),
// //   });
// //   const cardClass = isOfficeHQ
// //     ? 'employee-card-hover bg-office-hq'
// //     : 'employee-card-hover bg-default';

// //   // Fetch profile image
// //   useEffect(() => {
// //     if (photoUrl) {
// //       axios
// //         .get(`${process.env.REACT_APP_BACKEND_URL}/${photoUrl}`, {
// //           headers,
// //           responseType: 'blob',
// //         })
// //         .then((response) => {
// //           const imageUrl = URL.createObjectURL(response.data);
// //           setAvatar(imageUrl);
// //         })
// //         .catch((err) => {
// //           console.error('Error fetching photo:', err);
// //           setAvatar('/default-profile.jpg');
// //         });
// //     } else {
// //       setAvatar('/default-profile.jpg');
// //     }
// //   }, [photoUrl, API_KEY]);

// //   // Debug: Log punch entries
// //   console.log(`Punch entries for ${name}:`, {
// //     length: employeePunches.length,
// //     punches: employeePunches,
// //     firstPunchIn,
// //     latestPunchOut,
// //   });

// //   const formatTime = (time) => {
// //     if (!time) return '—';
// //     try {
// //       if (typeof time === 'string' && time.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
// //         return time.slice(11, 16);
// //       }
// //       const date = new Date(time);
// //       if (isNaN(date.getTime())) return '—';
// //       const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
// //       return istDate.toLocaleTimeString('en-IN', {
// //         hour: '2-digit',
// //         minute: '2-digit',
// //         hour12: false,
// //       });
// //     } catch (error) {
// //       console.error('Error formatting time:', time, error);
// //       return '—';
// //     }
// //   };

// //   const calculateTotalWorkHours = (punches) => {
// //     let totalMs = 0;

// //     punches.forEach((punch, index) => {
// //       if (punch.punchin_time) {
// //         const start = new Date(punch.punchin_time);
// //         const end = punch.punchout_time ? new Date(punch.punchout_time) : new Date();

// //         if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
// //           totalMs += end - start;
// //           const durationMinutes = Math.round((end - start) / (1000 * 60));
// //           const hours = Math.floor(durationMinutes / 60);
// //           const minutes = durationMinutes % 60;
// //           console.log(
// //             `Punch ${index + 1}: ${punch.punchin_time} to ${punch.punchout_time || 'now'} = ${hours}h ${minutes}m`
// //           );
// //         } else {
// //           console.warn(`Invalid punch pair at index ${index}:`, punch);
// //         }
// //       } else {
// //         console.warn(`Missing punchin_time at index ${index}:`, punch);
// //       }
// //     });

// //     const totalMinutes = Math.round(totalMs / (1000 * 60));
// //     const hours = Math.floor(totalMinutes / 60);
// //     const minutes = totalMinutes % 60;

// //     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// //   };

// //   const totalWorkHours = calculateTotalWorkHours(employeePunches);

// //   return (
// //     <div
// //       className={cardClass}
// //       onMouseEnter={() => setHovered(true)}
// //       onMouseLeave={() => setHovered(false)}
// //     >
// //       <div className="hover-indicator">
// //         <Eye size={16} />
// //       </div>

// //       <div className="card-main">
// //         <div className="profile-section-admin">
// //           <img src={avatar} alt="Profile" className="profile-img1" />
// //           <div className="profile-info">
// //             <span className="profile-name">{name}</span>
// //           </div>
// //         </div>

// //         <hr className="divider" />

// //         <div className="time-section-centered">
// //           <div className="in-time">
// //             <span className="label">In</span>
// //             <span className="green">{formatTime(firstPunchIn)}</span>
// //           </div>
// //           <div className="total-hours-centered">
// //             <span className="label">Totalhrs</span>
// //             <span className="hours">{totalWorkHours}</span>
// //           </div>
// //           <div className="out-time">
// //             <span className="label">Out</span>
// //             <span className="red">{formatTime(latestPunchOut)}</span>
// //           </div>
// //         </div>

// //         <hr className="divider" />
// //       </div>

// //       {hovered && (
// //         <div className="card-popup">
// //           <h4>Punch History</h4>
// //           <div className="punch-history">
// //             {employeePunches.map((entry, idx) => (
// //               <div
// //                 className="punch-entry"
// //                 key={`${entry.punchin_time || idx}-${entry.punchout_time || idx}`}
// //               >
// //                 <div className="punch-details-grid">
// //                   <div className="punch-detail">
// //                     <strong>Punch In Time:</strong> {formatTime(entry.punchin_time)}
// //                   </div>
// //                   <div className="punch-detail">
// //                     <strong>Punch Out Time:</strong> {formatTime(entry.punchout_time)}
// //                   </div>
// //                   <div className="punch-detail">
// //                     <strong>Punch In Device:</strong> {entry.punchin_device || '—'}
// //                   </div>
// //                   <div className="punch-detail">
// //                     <strong>Punch Out Device:</strong> {entry.punchout_device || '—'}
// //                   </div>
// //                   <div className="punch-detail">
// //                     <strong>Punch In Location:</strong> {entry.punchin_location || '—'}
// //                   </div>
// //                   <div className="punch-detail">
// //                     <strong>Punch Out Location:</strong> {entry.punchout_location || '—'}
// //                   </div>
// //                 </div>
// //                 <hr />
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const TimeSlotGroup = ({ time, slotKey, employeesData = [], isOpen, setSlotOpen }) => {
// //   const handleToggle = () => {
// //     setSlotOpen(slotKey, !isOpen);
// //   };

// //   return (
// //     <div className="time-group">
// //       <div className="time-header" onClick={handleToggle}>
// //         <h3>{time}</h3>
// //         <span className="expand-icon">{isOpen ? '˄' : '˅'}</span>
// //       </div>
// //       {isOpen && (
// //         <div className="card-row">
// //           {employeesData.map((empPunches, idx) => (
// //             <EmployeeCardWithHover key={idx} employeePunches={empPunches} />
// //           ))}
// //         </div>
// //       )}
// //       <hr className="time-divider" />
// //     </div>
// //   );
// // };

// // const EmployeeLogin = () => {
// //   const [activeTab, setActiveTab] = useState('today');
// //   const [punchData, setPunchData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {} });

// //   useEffect(() => {
// //     const fetchPunchData = async () => {
// //       setLoading(true);
// //       setError(null);

// //       try {
// //         const API_KEY = process.env.REACT_APP_API_KEY;
// //         const backendUrl = process.env.REACT_APP_BACKEND_URL;

// //         if (!API_KEY) throw new Error('API Key is missing.');
// //         if (!backendUrl) throw new Error('Backend URL is missing.');

// //         const response = await axios.get(`${backendUrl}/api/employeelogin/today-yesterday-punches`, {
// //           headers,
// //           withCredentials: true,
// //         });

// //         console.log('API Response:', response.data);

// //         const data = Array.isArray(response.data)
// //           ? response.data
// //           : Array.isArray(response.data.data)
// //           ? response.data.data
// //           : [];

// //         setPunchData(data);

// //         const grouped = groupByDayAndEmployee(data);
// //         const activeGroup = activeTab === 'today' ? grouped.Today : grouped.Yesterday;
// //         const slots = groupByHourSlots(activeGroup);
// //         const slotKeys = Object.keys(slots);
// //         const newSlotStates = slotKeys.reduce(
// //           (acc, slot, idx) => ({
// //             ...acc,
// //             [slot]: idx === 0,
// //           }),
// //           {}
// //         );
// //         setSlotStates((prev) => ({
// //           ...prev,
// //           [activeTab]: newSlotStates,
// //         }));
// //       } catch (err) {
// //         console.error(err);
// //         setError(err.response?.data?.message || err.message || 'Error fetching punch data.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchPunchData();
// //   }, [activeTab]);

// //   const groupByDayAndEmployee = (data) => {
// //     const grouped = { Today: {}, Yesterday: {} };

// //     if (!Array.isArray(data)) return grouped;

// //     data.forEach((record) => {
// //       const day = record.record_day;
// //       const empId = record.employee_id;

// //       if (!grouped[day][empId]) {
// //         grouped[day][empId] = [];
// //       }
// //       grouped[day][empId].push(record);
// //     });

// //     console.log('Grouped by Day and Employee:', grouped);
// //     return grouped;
// //   };

// //   const groupByHourSlots = (activeGroup) => {
// //     const slotMap = {};

// //     Object.entries(activeGroup).forEach(([empId, punches]) => {
// //       const sorted = [...punches].sort((a, b) => new Date(a.punchin_time) - new Date(b.punchin_time));
// //       const firstPunch = sorted[0];

// //       if (!firstPunch || !firstPunch.punchin_time) return;

// //       const hour = new Date(firstPunch.punchin_time).getHours();
// //       const slotLabel = `${hour}-${hour + 1}`;

// //       if (!slotMap[slotLabel]) slotMap[slotLabel] = [];
// //       slotMap[slotLabel].push(sorted);
// //     });

// //     console.log('Grouped by Hour Slots:', slotMap);
// //     return slotMap;
// //   };

// //   const setSlotOpen = (slot, isOpen) => {
// //     setSlotStates((prev) => ({
// //       ...prev,
// //       [activeTab]: {
// //         ...prev[activeTab],
// //         [slot]: isOpen,
// //       },
// //     }));
// //   };

// //   const groupedData = groupByDayAndEmployee(punchData);
// //   const activeGroup = activeTab === 'today' ? groupedData.Today : groupedData.Yesterday;
// //   const slotGroupedData = groupByHourSlots(activeGroup);

// //   return (
// //     <div className="employee-login">
// //       <h2 className="heading">Employee Punch Records</h2>

// //       <div className="tab-buttons">
// //         <button className={activeTab === 'today' ? 'active' : ''} onClick={() => setActiveTab('today')}>
// //           Today
// //         </button>
// //         <button className={activeTab === 'yesterday' ? 'active' : ''} onClick={() => setActiveTab('yesterday')}>
// //           Yesterday
// //         </button>
// //       </div>

// //       {loading && <p>Loading...</p>}
// //       {error && <p style={{ color: 'red' }}>{error}</p>}

// //       {!loading && !error && (
// //         <>
// //           {Object.keys(slotGroupedData).length === 0 ? (
// //             <p>No punch data available for {activeTab}.</p>
// //           ) : (
// //             Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
// //               <TimeSlotGroup
// //                 key={slot}
// //                 time={`${slot} ${activeTab === 'today' ? '(Today)' : '(Yesterday)'}`}
// //                 slotKey={slot}
// //                 employeesData={empPunchesArr}
// //                 isOpen={slotStates[activeTab][slot] || false}
// //                 setSlotOpen={setSlotOpen}
// //               />
// //             ))
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default EmployeeLogin;



// import React, { useEffect, useState } from 'react';
// import './EmployeeLogin.css';
// import { Eye } from 'lucide-react';
// import axios from 'axios';

// const EmployeeCardWithHover = ({ employeePunches }) => {
//   const [hovered, setHovered] = useState(false);
//   const [avatar, setAvatar] = useState('/default-profile.jpg'); // Default avatar
// const meId = JSON.parse(
//     localStorage.getItem("dashboardData") || "{}"
//   ).employeeId;
//   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
//   // Validate employeePunches
//   if (!employeePunches || !Array.isArray(employeePunches) || employeePunches.length === 0) {
//     return <div className="employee-card-hover">No punch data available</div>;
//   }

//   // Get first punch-in and latest punch-out
//   const sortedByPunchIn = [...employeePunches].sort(
//     (a, b) => new Date(a.punchin_time) - new Date(b.punchin_time)
//   );
//   const firstPunchIn = sortedByPunchIn[0]?.punchin_time;

//   const validPunchOuts = employeePunches.filter((p) => p.punchout_time);
//   const sortedByPunchOut = [...validPunchOuts].sort(
//     (a, b) => new Date(b.punchout_time) - new Date(a.punchout_time)
//   );
//   const latestPunchOut = sortedByPunchOut[0]?.punchout_time;

//   const latest = employeePunches[employeePunches.length - 1];
//   const name = `${latest.first_name || 'Unknown'} ${latest.last_name || ''}`.trim();
//   const photoUrl = latest.photo_url || null;
//   const API_KEY = process.env.REACT_APP_API_KEY;

//   // Determine card color based on latest location
//   const isOfficeHQ =
//     (latest.punchin_location && typeof latest.punchin_location === 'string' &&
//      latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
//     (latest.punchout_location && typeof latest.punchout_location === 'string' &&
//      latest.punchout_location.trim().toLowerCase().includes('office hq'));
//   console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
//     punchin_location: latest.punchin_location,
//     punchout_location: latest.punchout_location,
//     punchin_type: typeof latest.punchin_location,
//     punchout_type: typeof latest.punchout_location,
//     punchin_raw: latest.punchin_location?.trim(),
//     punchout_raw: latest.punchout_location?.trim(),
//   });
//   const cardClass = isOfficeHQ
//     ? 'employee-card-hover bg-office-hq'
//     : 'employee-card-hover bg-default';

//   // Fetch profile image
//   useEffect(() => {
//     if (photoUrl) {
//       axios
//         .get(`${process.env.REACT_APP_BACKEND_URL}/${photoUrl}`, {
//           headers,
//           responseType: 'blob',
//         })
//         .then((response) => {
//           const imageUrl = URL.createObjectURL(response.data);
//           setAvatar(imageUrl);
//         })
//         .catch((err) => {
//           console.error('Error fetching photo:', err);
//           setAvatar('/default-profile.jpg');
//         });
//     } else {
//       setAvatar('/default-profile.jpg');
//     }
//   }, [photoUrl, API_KEY]);

//   // Debug: Log punch entries
//   console.log(`Punch entries for ${name}:`, {
//     length: employeePunches.length,
//     punches: employeePunches,
//     firstPunchIn,
//     latestPunchOut,
//   });

//   const formatTime = (time) => {
//     if (!time) return '—';
//     try {
//       if (typeof time === 'string' && time.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
//         return time.slice(11, 16);
//       }
//       const date = new Date(time);
//       if (isNaN(date.getTime())) return '—';
//       const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
//       return istDate.toLocaleTimeString('en-IN', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false,
//       });
//     } catch (error) {
//       console.error('Error formatting time:', time, error);
//       return '—';
//     }
//   };

//   const calculateTotalWorkHours = (punches) => {
//     let totalMs = 0;

//     punches.forEach((punch, index) => {
//       if (punch.punchin_time) {
//         const start = new Date(punch.punchin_time);
//         const end = punch.punchout_time ? new Date(punch.punchout_time) : new Date();

//         if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
//           totalMs += end - start;
//           const durationMinutes = Math.round((end - start) / (1000 * 60));
//           const hours = Math.floor(durationMinutes / 60);
//           const minutes = durationMinutes % 60;
//           console.log(
//             `Punch ${index + 1}: ${punch.punchin_time} to ${punch.punchout_time || 'now'} = ${hours}h ${minutes}m`
//           );
//         } else {
//           console.warn(`Invalid punch pair at index ${index}:`, punch);
//         }
//       } else {
//         console.warn(`Missing punchin_time at index ${index}:`, punch);
//       }
//     });

//     const totalMinutes = Math.round(totalMs / (1000 * 60));
//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = totalMinutes % 60;

//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//   };

//   const totalWorkHours = calculateTotalWorkHours(employeePunches);

//   return (
//     <div
//       className={cardClass}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <div className="hover-indicator">
//         <Eye size={16} />
//       </div>

//       <div className="card-main">
//         <div className="profile-section-admin">
//           <img src={avatar} alt="Profile" className="profile-img1" />
//           <div className="profile-info">
//             <span className="profile-name">{name}</span>
//           </div>
//         </div>

//         <hr className="divider" />

//         <div className="time-section-centered">
//           <div className="in-time">
//             <span className="label">In</span>
//             <span className="green">{formatTime(firstPunchIn)}</span>
//           </div>
//           <div className="total-hours-centered">
//             <span className="label">Totalhrs</span>
//             <span className="hours">{totalWorkHours}</span>
//           </div>
//           <div className="out-time">
//             <span className="label">Out</span>
//             <span className="red">{formatTime(latestPunchOut)}</span>
//           </div>
//         </div>

//         <hr className="divider" />
//       </div>

//       {hovered && (
//         <div className="card-popup">
//           <h4>Punch History</h4>
//           <div className="punch-history">
//             {employeePunches.map((entry, idx) => (
//               <div
//                 className="punch-entry"
//                 key={`${entry.punchin_time || idx}-${entry.punchout_time || idx}`}
//               >
//                 <div className="punch-details-grid">
//                   <div className="punch-detail">
//                     <strong>Punch In Time:</strong> {formatTime(entry.punchin_time)}
//                   </div>
//                   <div className="punch-detail">
//                     <strong>Punch Out Time:</strong> {formatTime(entry.punchout_time)}
//                   </div>
//                   <div className="punch-detail">
//                     <strong>Punch In Device:</strong> {entry.punchin_device || '—'}
//                   </div>
//                   <div className="punch-detail">
//                     <strong>Punch Out Device:</strong> {entry.punchout_device || '—'}
//                   </div>
//                   <div className="punch-detail">
//                     <strong>Punch In Location:</strong> {entry.punchin_location || '—'}
//                   </div>
//                   <div className="punch-detail">
//                     <strong>Punch Out Location:</strong> {entry.punchout_location || '—'}
//                   </div>
//                 </div>
//                 <hr />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const TimeSlotGroup = ({ time, slotKey, employeesData = [], isOpen, setSlotOpen }) => {
//   const handleToggle = () => {
//     setSlotOpen(slotKey, !isOpen);
//   };

//   return (
//     <div className="time-group">
//       <div className="time-header" onClick={handleToggle}>
//         <h3>{time}</h3>
//         <span className="expand-icon">{isOpen ? '˄' : '˅'}</span>
//       </div>
//       {isOpen && (
//         <div className="card-row">
//           {employeesData.map((empPunches, idx) => (
//             <EmployeeCardWithHover key={idx} employeePunches={empPunches} />
//           ))}
//         </div>
//       )}
//       <hr className="time-divider" />
//     </div>
//   );
// };

// const EmployeeLogin = () => {
//   const [activeTab, setActiveTab] = useState('today');
//   const [punchData, setPunchData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {} });

//   useEffect(() => {
//     const fetchPunchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const API_KEY = process.env.REACT_APP_API_KEY;
//         const backendUrl = process.env.REACT_APP_BACKEND_URL;

//         if (!API_KEY) throw new Error('API Key is missing.');
//         if (!backendUrl) throw new Error('Backend URL is missing.');

//         const response = await axios.get(`${backendUrl}/api/employeelogin/today-yesterday-punches`, {
//           headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': API_KEY,
//           },
//           withCredentials: true,
//         });

//         console.log('API Response:', response.data);

//         const data = Array.isArray(response.data)
//           ? response.data
//           : Array.isArray(response.data.data)
//           ? response.data.data
//           : [];

//         setPunchData(data);

//         const grouped = groupByDayAndEmployee(data);
//         const activeGroup = activeTab === 'today' ? grouped.Today : grouped.Yesterday;
//         const slots = groupByHourSlots(activeGroup);
//         const slotKeys = Object.keys(slots);
//         const newSlotStates = slotKeys.reduce(
//           (acc, slot, idx) => ({
//             ...acc,
//             [slot]: idx === 0,
//           }),
//           {}
//         );
//         setSlotStates((prev) => ({
//           ...prev,
//           [activeTab]: newSlotStates,
//         }));
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.message || err.message || 'Error fetching punch data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPunchData();
//   }, [activeTab]);

//   const groupByDayAndEmployee = (data) => {
//     const grouped = { Today: {}, Yesterday: {} };

//     if (!Array.isArray(data)) return grouped;

//     data.forEach((record) => {
//       const day = record.record_day;
//       const empId = record.employee_id;

//       if (!grouped[day][empId]) {
//         grouped[day][empId] = [];
//       }
//       grouped[day][empId].push(record);
//     });

//     console.log('Grouped by Day and Employee:', grouped);
//     return grouped;
//   };

//   const groupByHourSlots = (activeGroup) => {
//     const slotMap = {};

//     Object.entries(activeGroup).forEach(([empId, punches]) => {
//       const sorted = [...punches].sort((a, b) => new Date(a.punchin_time) - new Date(b.punchin_time));
//       const firstPunch = sorted[0];

//       if (!firstPunch || !firstPunch.punchin_time) return;

//       const hour = new Date(firstPunch.punchin_time).getHours();
//       const slotLabel = `${hour}-${hour + 1}`;

//       if (!slotMap[slotLabel]) slotMap[slotLabel] = [];
//       slotMap[slotLabel].push(sorted);
//     });

//     console.log('Grouped by Hour Slots:', slotMap);
//     return slotMap;
//   };

//   const setSlotOpen = (slot, isOpen) => {
//     setSlotStates((prev) => ({
//       ...prev,
//       [activeTab]: {
//         ...prev[activeTab],
//         [slot]: isOpen,
//       },
//     }));
//   };

//   const groupedData = groupByDayAndEmployee(punchData);
//   const activeGroup = activeTab === 'today' ? groupedData.Today : groupedData.Yesterday;
//   const slotGroupedData = groupByHourSlots(activeGroup);

//   return (
//     <div className="employee-login">
//       <h2 className="heading">Employee Punch Records</h2>

//       <div className="tab-buttons">
//         <button className={activeTab === 'today' ? 'active' : ''} onClick={() => setActiveTab('today')}>
//           Today
//         </button>
//         <button className={activeTab === 'yesterday' ? 'active' : ''} onClick={() => setActiveTab('yesterday')}>
//           Yesterday
//         </button>
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {!loading && !error && (
//         <>
//           {Object.keys(slotGroupedData).length === 0 ? (
//             <p>No punch data available for {activeTab}.</p>
//           ) : (
//             Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
//               <TimeSlotGroup
//                 key={slot}
//                 time={`${slot} ${activeTab === 'today' ? '(Today)' : '(Yesterday)'}`}
//                 slotKey={slot}
//                 employeesData={empPunchesArr}
//                 isOpen={slotStates[activeTab][slot] || false}
//                 setSlotOpen={setSlotOpen}
//               />
//             ))
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default EmployeeLogin;

import React, { useEffect, useState } from 'react';
import './EmployeeLogin.css';
import { Eye } from 'lucide-react';
import axios from 'axios';

const EmployeeCardWithHover = ({ employeePunches }) => {
  const [hovered, setHovered] = useState(false);
  const [avatar, setAvatar] = useState('/default-profile.jpg'); // Default avatar

  // Validate employeePunches
  if (!employeePunches || !Array.isArray(employeePunches) || employeePunches.length === 0) {
    return <div className="employee-card-hover">No punch data available</div>;
  }

  // Get first punch-in and latest punch-out
  const sortedByPunchIn = [...employeePunches].sort(
    (a, b) => new Date(a.punchin_time) - new Date(b.punchin_time)
  );
  const firstPunchIn = sortedByPunchIn[0]?.punchin_time;

  const validPunchOuts = employeePunches.filter((p) => p.punchout_time);
  const sortedByPunchOut = [...validPunchOuts].sort(
    (a, b) => new Date(b.punchout_time) - new Date(a.punchout_time)
  );
  const latestPunchOut = sortedByPunchOut[0]?.punchout_time;

  const latest = employeePunches[employeePunches.length - 1];
  const name = `${latest.first_name || 'Unknown'} ${latest.last_name || ''}`.trim();
  const photoUrl = latest.photo_url || null;
  const API_KEY = process.env.REACT_APP_API_KEY;
const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
  // Determine card color based on latest location
  const isOfficeHQ =
    (latest.punchin_location && typeof latest.punchin_location === 'string' &&
     latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
    (latest.punchout_location && typeof latest.punchout_location === 'string' &&
     latest.punchout_location.trim().toLowerCase().includes('office hq'));
  console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
    punchin_location: latest.punchin_location,
    punchout_location: latest.punchout_location,
    punchin_type: typeof latest.punchin_location,
    punchout_type: typeof latest.punchout_location,
    punchin_raw: latest.punchin_location?.trim(),
    punchout_raw: latest.punchout_location?.trim(),
  });
  const cardClass = isOfficeHQ
    ? 'employee-card-hover bg-office-hq'
    : 'employee-card-hover bg-default';

  // Fetch profile image
  useEffect(() => {
    if (photoUrl) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/${photoUrl}`, {
          headers,
          responseType: 'blob',
        })
        .then((response) => {
          const imageUrl = URL.createObjectURL(response.data);
          setAvatar(imageUrl);
        })
        .catch((err) => {
          console.error('Error fetching photo:', err);
          setAvatar('/default-profile.jpg');
        });
    } else {
      setAvatar('/default-profile.jpg');
    }
  }, [photoUrl, API_KEY]);

  // Debug: Log punch entries
  console.log(`Punch entries for ${name}:`, {
    length: employeePunches.length,
    punches: employeePunches,
    firstPunchIn,
    latestPunchOut,
  });

  const formatTime = (time) => {
    if (!time) return '—';
    try {
      if (typeof time === 'string' && time.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        return time.slice(11, 16);
      }
      const date = new Date(time);
      if (isNaN(date.getTime())) return '—';
      const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
      return istDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (error) {
      console.error('Error formatting time:', time, error);
      return '—';
    }
  };

  const calculateTotalWorkHours = (punches) => {
    let totalMs = 0;

    punches.forEach((punch, index) => {
      if (punch.punchin_time) {
        const start = new Date(punch.punchin_time);
        const end = punch.punchout_time ? new Date(punch.punchout_time) : new Date();

        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
          totalMs += end - start;
          const durationMinutes = Math.round((end - start) / (1000 * 60));
          const hours = Math.floor(durationMinutes / 60);
          const minutes = durationMinutes % 60;
          console.log(
            `Punch ${index + 1}: ${punch.punchin_time} to ${punch.punchout_time || 'now'} = ${hours}h ${minutes}m`
          );
        } else {
          console.warn(`Invalid punch pair at index ${index}:`, punch);
        }
      } else {
        console.warn(`Missing punchin_time at index ${index}:`, punch);
      }
    });

    const totalMinutes = Math.round(totalMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const totalWorkHours = calculateTotalWorkHours(employeePunches);

  return (
    <div
      className={cardClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="hover-indicator">
        <Eye size={16} />
      </div>

      <div className="card-main">
        <div className="profile-section-admin">
          <img src={avatar} alt="Profile" className="profile-img1" />
          <div className="profile-info">
            <span className="profile-name">{name}</span>
          </div>
        </div>

        <hr className="divider" />

        <div className="time-section-centered">
          <div className="in-time">
            <span className="label">In</span>
            <span className="green">{formatTime(firstPunchIn)}</span>
          </div>
          <div className="total-hours-centered">
            <span className="label">Totalhrs</span>
            <span className="hours">{totalWorkHours}</span>
          </div>
          <div className="out-time">
            <span className="label">Out</span>
            <span className="red">{formatTime(latestPunchOut)}</span>
          </div>
        </div>

        <hr className="divider" />
      </div>

      {hovered && (
        <div className="card-popup">
          <h4>Punch History</h4>
          <div className="punch-history">
            {employeePunches.map((entry, idx) => (
              <div
                className="punch-entry"
                key={`${entry.punchin_time || idx}-${entry.punchout_time || idx}`}
              >
                <div className="punch-details-grid">
                  <div className="punch-detail">
                    <strong>Punch In Time:</strong> {formatTime(entry.punchin_time)}
                  </div>
                  <div className="punch-detail">
                    <strong>Punch Out Time:</strong> {formatTime(entry.punchout_time)}
                  </div>
                  <div className="punch-detail">
                    <strong>Punch In Device:</strong> {entry.punchin_device || '—'}
                  </div>
                  <div className="punch-detail">
                    <strong>Punch Out Device:</strong> {entry.punchout_device || '—'}
                  </div>
                  <div className="punch-detail">
                    <strong>Punch In Location:</strong> {entry.punchin_location || '—'}
                  </div>
                  <div className="punch-detail">
                    <strong>Punch Out Location:</strong> {entry.punchout_location || '—'}
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TimeSlotGroup = ({ time, slotKey, employeesData = [], isOpen, setSlotOpen }) => {
  const handleToggle = () => {
    setSlotOpen(slotKey, !isOpen);
  };

  return (
    <div className="time-group">
      <div className="time-header" onClick={handleToggle}>
        <h3>{time}</h3>
        <span className="expand-icon">{isOpen ? '˄' : '˅'}</span>
      </div>
      {isOpen && (
        <div className="card-row">
          {employeesData.map((empPunches, idx) => (
            <EmployeeCardWithHover key={idx} employeePunches={empPunches} />
          ))}
        </div>
      )}
      <hr className="time-divider" />
    </div>
  );
};

const EmployeeLogin = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [punchData, setPunchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {} });

  useEffect(() => {
    const fetchPunchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const API_KEY = process.env.REACT_APP_API_KEY;
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

        if (!API_KEY) throw new Error('API Key is missing.');
        if (!backendUrl) throw new Error('Backend URL is missing.');

        const response = await axios.get(`${backendUrl}/api/employeelogin/today-yesterday-punches`, {
          headers,
          withCredentials: true,
        });

        console.log('API Response:', response.data);

        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setPunchData(data);

        const grouped = groupByDayAndEmployee(data);
        const activeGroup = activeTab === 'today' ? grouped.Today : grouped.Yesterday;
        const slots = groupByHourSlots(activeGroup);
        const slotKeys = Object.keys(slots);
        const newSlotStates = slotKeys.reduce(
          (acc, slot, idx) => ({
            ...acc,
            [slot]: idx === 0,
          }),
          {}
        );
        setSlotStates((prev) => ({
          ...prev,
          [activeTab]: newSlotStates,
        }));
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || 'Error fetching punch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPunchData();
  }, [activeTab]);

  const groupByDayAndEmployee = (data) => {
    const grouped = { Today: {}, Yesterday: {} };

    if (!Array.isArray(data)) return grouped;

    data.forEach((record) => {
      const day = record.record_day;
      const empId = record.employee_id;

      if (!grouped[day][empId]) {
        grouped[day][empId] = [];
      }
      grouped[day][empId].push(record);
    });

    console.log('Grouped by Day and Employee:', grouped);
    return grouped;
  };

  const groupByHourSlots = (activeGroup) => {
    const slotMap = {};

    Object.entries(activeGroup).forEach(([empId, punches]) => {
      const sorted = [...punches].sort((a, b) => new Date(a.punchin_time) - new Date(b.punchin_time));
      const firstPunch = sorted[0];

      if (!firstPunch || !firstPunch.punchin_time) return;

      const hour = new Date(firstPunch.punchin_time).getHours();
      const slotLabel = `${hour}-${hour + 1}`;

      if (!slotMap[slotLabel]) slotMap[slotLabel] = [];
      slotMap[slotLabel].push(sorted);
    });

    console.log('Grouped by Hour Slots:', slotMap);
    return slotMap;
  };

  const setSlotOpen = (slot, isOpen) => {
    setSlotStates((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [slot]: isOpen,
      },
    }));
  };

  const groupedData = groupByDayAndEmployee(punchData);
  const activeGroup = activeTab === 'today' ? groupedData.Today : groupedData.Yesterday;
  const slotGroupedData = groupByHourSlots(activeGroup);

  return (
    <div className="employee-login">
      <h2 className="heading">Employee Punch Records</h2>

      <div className="tab-buttons">
        <button className={activeTab === 'today' ? 'active' : ''} onClick={() => setActiveTab('today')}>
          Today
        </button>
        <button className={activeTab === 'yesterday' ? 'active' : ''} onClick={() => setActiveTab('yesterday')}>
          Yesterday
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          {Object.keys(slotGroupedData).length === 0 ? (
            <p>No punch data available for {activeTab}.</p>
          ) : (
            Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
              <TimeSlotGroup
                key={slot}
                time={`${slot} ${activeTab === 'today' ? '(Today)' : '(Yesterday)'}`}
                slotKey={slot}
                employeesData={empPunchesArr}
                isOpen={slotStates[activeTab][slot] || false}
                setSlotOpen={setSlotOpen}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeLogin;