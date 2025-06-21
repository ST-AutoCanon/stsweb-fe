

// // // // import React, { useEffect, useState } from 'react';
// // // // import './EmployeeLogin.css';
// // // // import { Eye } from 'lucide-react';
// // // // import axios from 'axios';

// // // // const EmployeeCardWithHover = ({ employeePunches }) => {
// // // //   const [hovered, setHovered] = useState(false);
// // // //   const [avatar, setAvatar] = useState('/default-profile.jpg'); // Default avatar

// // // //   // Validate employeePunches
// // // //   if (!employeePunches || !Array.isArray(employeePunches) || employeePunches.length === 0) {
// // // //     return <div className="employee-card-hover">No punch data available</div>;
// // // //   }

// // // //   // Get first punch-in and latest punch-out
// // // //   const sortedByPunchIn = [...employeePunches].sort(
// // // //     (a, b) => new Date(a.punchin_time) - new Date(b.punchin_time)
// // // //   );
// // // //   const firstPunchIn = sortedByPunchIn[0]?.punchin_time;

// // // //   const validPunchOuts = employeePunches.filter((p) => p.punchout_time);
// // // //   const sortedByPunchOut = [...validPunchOuts].sort(
// // // //     (a, b) => new Date(b.punchout_time) - new Date(a.punchout_time)
// // // //   );
// // // //   const latestPunchOut = sortedByPunchOut[0]?.punchout_time;

// // // //   const latest = employeePunches[employeePunches.length - 1];
// // // //   const name = `${latest.first_name || 'Unknown'} ${latest.last_name || ''}`.trim();
// // // //   const photoUrl = latest.photo_url || null;
// // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // // const meId = JSON.parse(
// // // //     localStorage.getItem("dashboardData") || "{}"
// // // //   ).employeeId;
// // // //   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
// // // //   // Determine card color based on latest location
// // // //   const isOfficeHQ =
// // // //     (latest.punchin_location && typeof latest.punchin_location === 'string' &&
// // // //      latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
// // // //     (latest.punchout_location && typeof latest.punchout_location === 'string' &&
// // // //      latest.punchout_location.trim().toLowerCase().includes('office hq'));
// // // //   console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
// // // //     punchin_location: latest.punchin_location,
// // // //     punchout_location: latest.punchout_location,
// // // //     punchin_type: typeof latest.punchin_location,
// // // //     punchout_type: typeof latest.punchout_location,
// // // //     punchin_raw: latest.punchin_location?.trim(),
// // // //     punchout_raw: latest.punchout_location?.trim(),
// // // //   });
// // // //   const cardClass = isOfficeHQ
// // // //     ? 'employee-card-hover bg-office-hq'
// // // //     : 'employee-card-hover bg-default';

// // // //   // Fetch profile image
// // // //   useEffect(() => {
// // // //     if (photoUrl) {
// // // //       axios
// // // //         .get(`${process.env.REACT_APP_BACKEND_URL}/${photoUrl}`, {
// // // //           headers,
// // // //           responseType: 'blob',
// // // //         })
// // // //         .then((response) => {
// // // //           const imageUrl = URL.createObjectURL(response.data);
// // // //           setAvatar(imageUrl);
// // // //         })
// // // //         .catch((err) => {
// // // //           console.error('Error fetching photo:', err);
// // // //           setAvatar('/default-profile.jpg');
// // // //         });
// // // //     } else {
// // // //       setAvatar('/default-profile.jpg');
// // // //     }
// // // //   }, [photoUrl, API_KEY]);

// // // //   // Debug: Log punch entries
// // // //   console.log(`Punch entries for ${name}:`, {
// // // //     length: employeePunches.length,
// // // //     punches: employeePunches,
// // // //     firstPunchIn,
// // // //     latestPunchOut,
// // // //   });

// // // //   const formatTime = (time) => {
// // // //     if (!time) return '—';
// // // //     try {
// // // //       if (typeof time === 'string' && time.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
// // // //         return time.slice(11, 16);
// // // //       }
// // // //       const date = new Date(time);
// // // //       if (isNaN(date.getTime())) return '—';
// // // //       const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
// // // //       return istDate.toLocaleTimeString('en-IN', {
// // // //         hour: '2-digit',
// // // //         minute: '2-digit',
// // // //         hour12: false,
// // // //       });
// // // //     } catch (error) {
// // // //       console.error('Error formatting time:', time, error);
// // // //       return '—';
// // // //     }
// // // //   };

// // // //   const calculateTotalWorkHours = (punches) => {
// // // //     let totalMs = 0;

// // // //     punches.forEach((punch, index) => {
// // // //       if (punch.punchin_time) {
// // // //         const start = new Date(punch.punchin_time);
// // // //         const end = punch.punchout_time ? new Date(punch.punchout_time) : new Date();

// // // //         if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
// // // //           totalMs += end - start;
// // // //           const durationMinutes = Math.round((end - start) / (1000 * 60));
// // // //           const hours = Math.floor(durationMinutes / 60);
// // // //           const minutes = durationMinutes % 60;
// // // //           console.log(
// // // //             `Punch ${index + 1}: ${punch.punchin_time} to ${punch.punchout_time || 'now'} = ${hours}h ${minutes}m`
// // // //           );
// // // //         } else {
// // // //           console.warn(`Invalid punch pair at index ${index}:`, punch);
// // // //         }
// // // //       } else {
// // // //         console.warn(`Missing punchin_time at index ${index}:`, punch);
// // // //       }
// // // //     });

// // // //     const totalMinutes = Math.round(totalMs / (1000 * 60));
// // // //     const hours = Math.floor(totalMinutes / 60);
// // // //     const minutes = totalMinutes % 60;

// // // //     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// // // //   };

// // // //   const totalWorkHours = calculateTotalWorkHours(employeePunches);

// // // //   return (
// // // //     <div
// // // //       className={cardClass}
// // // //       onMouseEnter={() => setHovered(true)}
// // // //       onMouseLeave={() => setHovered(false)}
// // // //     >
// // // //       <div className="hover-indicator">
// // // //         <Eye size={16} />
// // // //       </div>

// // // //       <div className="card-main">
// // // //         <div className="profile-section-admin">
// // // //           <img src={avatar} alt="Profile" className="profile-img1" />
// // // //           <div className="profile-info">
// // // //             <span className="profile-name">{name}</span>
// // // //           </div>
// // // //         </div>

// // // //         <hr className="divider" />

// // // //         <div className="time-section-centered">
// // // //           <div className="in-time">
// // // //             <span className="label">In</span>
// // // //             <span className="green">{formatTime(firstPunchIn)}</span>
// // // //           </div>
// // // //           <div className="total-hours-centered">
// // // //             <span className="label">Totalhrs</span>
// // // //             <span className="hours">{totalWorkHours}</span>
// // // //           </div>
// // // //           <div className="out-time">
// // // //             <span className="label">Out</span>
// // // //             <span className="red">{formatTime(latestPunchOut)}</span>
// // // //           </div>
// // // //         </div>

// // // //         <hr className="divider" />
// // // //       </div>

// // // //       {hovered && (
// // // //         <div className="card-popup">
// // // //           <h4>Punch History</h4>
// // // //           <div className="punch-history">
// // // //             {employeePunches.map((entry, idx) => (
// // // //               <div
// // // //                 className="punch-entry"
// // // //                 key={`${entry.punchin_time || idx}-${entry.punchout_time || idx}`}
// // // //               >
// // // //                 <div className="punch-details-grid">
// // // //                   <div className="punch-detail">
// // // //                     <strong>Punch In Time:</strong> {formatTime(entry.punchin_time)}
// // // //                   </div>
// // // //                   <div className="punch-detail">
// // // //                     <strong>Punch Out Time:</strong> {formatTime(entry.punchout_time)}
// // // //                   </div>
// // // //                   <div className="punch-detail">
// // // //                     <strong>Punch In Device:</strong> {entry.punchin_device || '—'}
// // // //                   </div>
// // // //                   <div className="punch-detail">
// // // //                     <strong>Punch Out Device:</strong> {entry.punchout_device || '—'}
// // // //                   </div>
// // // //                   <div className="punch-detail">
// // // //                     <strong>Punch In Location:</strong> {entry.punchin_location || '—'}
// // // //                   </div>
// // // //                   <div className="punch-detail">
// // // //                     <strong>Punch Out Location:</strong> {entry.punchout_location || '—'}
// // // //                   </div>
// // // //                 </div>
// // // //                 <hr />
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // const TimeSlotGroup = ({ time, slotKey, employeesData = [], isOpen, setSlotOpen }) => {
// // // //   const handleToggle = () => {
// // // //     setSlotOpen(slotKey, !isOpen);
// // // //   };

// // // //   return (
// // // //     <div className="time-group">
// // // //       <div className="time-header" onClick={handleToggle}>
// // // //         <h3>{time}</h3>
// // // //         <span className="expand-icon">{isOpen ? '˄' : '˅'}</span>
// // // //       </div>
// // // //       {isOpen && (
// // // //         <div className="card-row">
// // // //           {employeesData.map((empPunches, idx) => (
// // // //             <EmployeeCardWithHover key={idx} employeePunches={empPunches} />
// // // //           ))}
// // // //         </div>
// // // //       )}
// // // //       <hr className="time-divider" />
// // // //     </div>
// // // //   );
// // // // };

// // // // const EmployeeLogin = () => {
// // // //   const [activeTab, setActiveTab] = useState('today');
// // // //   const [punchData, setPunchData] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState(null);
// // // //   const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {} });

// // // //   useEffect(() => {
// // // //     const fetchPunchData = async () => {
// // // //       setLoading(true);
// // // //       setError(null);

// // // //       try {
// // // //         const API_KEY = process.env.REACT_APP_API_KEY;
// // // //         const backendUrl = process.env.REACT_APP_BACKEND_URL;
// // // // const meId = JSON.parse(
// // // //     localStorage.getItem("dashboardData") || "{}"
// // // //   ).employeeId;
// // // //   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// // // //         if (!API_KEY) throw new Error('API Key is missing.');
// // // //         if (!backendUrl) throw new Error('Backend URL is missing.');

// // // //         const response = await axios.get(`${backendUrl}/api/employeelogin/today-yesterday-punches`, {
// // // //           headers,
// // // //           withCredentials: true,
// // // //         });

// // // //         console.log('API Response:', response.data);

// // // //         const data = Array.isArray(response.data)
// // // //           ? response.data
// // // //           : Array.isArray(response.data.data)
// // // //           ? response.data.data
// // // //           : [];

// // // //         setPunchData(data);

// // // //         const grouped = groupByDayAndEmployee(data);
// // // //         const activeGroup = activeTab === 'today' ? grouped.Today : grouped.Yesterday;
// // // //         const slots = groupByHourSlots(activeGroup);
// // // //         const slotKeys = Object.keys(slots);
// // // //         const newSlotStates = slotKeys.reduce(
// // // //           (acc, slot, idx) => ({
// // // //             ...acc,
// // // //             [slot]: idx === 0,
// // // //           }),
// // // //           {}
// // // //         );
// // // //         setSlotStates((prev) => ({
// // // //           ...prev,
// // // //           [activeTab]: newSlotStates,
// // // //         }));
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //         setError(err.response?.data?.message || err.message || 'Error fetching punch data.');
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchPunchData();
// // // //   }, [activeTab]);

// // // //   const groupByDayAndEmployee = (data) => {
// // // //     const grouped = { Today: {}, Yesterday: {} };

// // // //     if (!Array.isArray(data)) return grouped;

// // // //     data.forEach((record) => {
// // // //       const day = record.record_day;
// // // //       const empId = record.employee_id;

// // // //       if (!grouped[day][empId]) {
// // // //         grouped[day][empId] = [];
// // // //       }
// // // //       grouped[day][empId].push(record);
// // // //     });

// // // //     console.log('Grouped by Day and Employee:', grouped);
// // // //     return grouped;
// // // //   };

// // // //   const groupByHourSlots = (activeGroup) => {
// // // //     const slotMap = {};

// // // //     Object.entries(activeGroup).forEach(([empId, punches]) => {
// // // //       const sorted = [...punches].sort((a, b) => new Date(a.punchin_time) - new Date(b.punchin_time));
// // // //       const firstPunch = sorted[0];

// // // //       if (!firstPunch || !firstPunch.punchin_time) return;

// // // //       const hour = new Date(firstPunch.punchin_time).getHours();
// // // //       const slotLabel = `${hour}-${hour + 1}`;

// // // //       if (!slotMap[slotLabel]) slotMap[slotLabel] = [];
// // // //       slotMap[slotLabel].push(sorted);
// // // //     });

// // // //     console.log('Grouped by Hour Slots:', slotMap);
// // // //     return slotMap;
// // // //   };

// // // //   const setSlotOpen = (slot, isOpen) => {
// // // //     setSlotStates((prev) => ({
// // // //       ...prev,
// // // //       [activeTab]: {
// // // //         ...prev[activeTab],
// // // //         [slot]: isOpen,
// // // //       },
// // // //     }));
// // // //   };

// // // //   const groupedData = groupByDayAndEmployee(punchData);
// // // //   const activeGroup = activeTab === 'today' ? groupedData.Today : groupedData.Yesterday;
// // // //   const slotGroupedData = groupByHourSlots(activeGroup);

// // // //   return (
// // // //     <div className="employee-login">
// // // //       <h2 className="heading">Employee Punch Records</h2>

// // // //       <div className="tab-buttons">
// // // //         <button className={activeTab === 'today' ? 'active' : ''} onClick={() => setActiveTab('today')}>
// // // //           Today
// // // //         </button>
// // // //         <button className={activeTab === 'yesterday' ? 'active' : ''} onClick={() => setActiveTab('yesterday')}>
// // // //           Yesterday
// // // //         </button>
// // // //       </div>

// // // //       {loading && <p>Loading...</p>}
// // // //       {error && <p style={{ color: 'red' }}>{error}</p>}

// // // //       {!loading && !error && (
// // // //         <>
// // // //           {Object.keys(slotGroupedData).length === 0 ? (
// // // //             <p>No punch data available for {activeTab}.</p>
// // // //           ) : (
// // // //             Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
// // // //               <TimeSlotGroup
// // // //                 key={slot}
// // // //                 time={`${slot} ${activeTab === 'today' ? '(Today)' : '(Yesterday)'}`}
// // // //                 slotKey={slot}
// // // //                 employeesData={empPunchesArr}
// // // //                 isOpen={slotStates[activeTab][slot] || false}
// // // //                 setSlotOpen={setSlotOpen}
// // // //               />
// // // //             ))
// // // //           )}
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default EmployeeLogin;

// // // import React, { useEffect, useState } from 'react';
// // // import './EmployeeLogin.css';
// // // import { Eye } from 'lucide-react';
// // // import axios from 'axios';

// // // const EmployeeCardWithHover = ({ employeePunches }) => {
// // //   const [hovered, setHovered] = useState(false);
// // //   const [avatar, setAvatar] = useState('/default-profile.jpg'); // Default avatar

// // //   // Validate employeePunches
// // //   if (!employeePunches || !Array.isArray(employeePunches) || employeePunches.length === 0) {
// // //     return <div className="employee-card-hover">No punch data available</div>;
// // //   }

// // //   // Get first punch-in and latest punch-out
// // //   const sortedByPunchIn = [...employeePunches].sort(
// // //     (a, b) => new Date(a.punchin_time) - new Date(b.punchin_time)
// // //   );
// // //   const firstPunchIn = sortedByPunchIn[0]?.punchin_time;

// // //   const validPunchOuts = employeePunches.filter((p) => p.punchout_time);
// // //   const sortedByPunchOut = [...validPunchOuts].sort(
// // //     (a, b) => new Date(b.punchout_time) - new Date(a.punchout_time)
// // //   );
// // //   const latestPunchOut = sortedByPunchOut[0]?.punchout_time;

// // //   const latest = employeePunches[employeePunches.length - 1];
// // //   const name = `${latest.first_name || 'Unknown'} ${latest.last_name || ''}`.trim();
// // //   const photoUrl = latest.photo_url || null;
// // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // //   const meId = JSON.parse(
// // //     localStorage.getItem("dashboardData") || "{}"
// // //   ).employeeId;
// // //   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// // //   // Determine card color based on latest location
// // //   const isOfficeHQ =
// // //     (latest.punchin_location && typeof latest.punchin_location === 'string' &&
// // //      latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
// // //     (latest.punchout_location && typeof latest.punchout_location === 'string' &&
// // //      latest.punchout_location.trim().toLowerCase().includes('office hq'));
// // //   console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
// // //     punchin_location: latest.punchin_location,
// // //     punchout_location: latest.punchout_location,
// // //     punchin_type: typeof latest.punchin_location,
// // //     punchout_type: typeof latest.punchout_location,
// // //     punchin_raw: latest.punchin_location?.trim(),
// // //     punchout_raw: latest.punchout_location?.trim(),
// // //   });
// // //   const cardClass = isOfficeHQ
// // //     ? 'employee-card-hover bg-office-hq'
// // //     : 'employee-card-hover bg-default';

// // //   // Fetch profile image
// // //   useEffect(() => {
// // //     if (photoUrl) {
// // //       axios
// // //         .get(`${process.env.REACT_APP_BACKEND_URL}/${photoUrl}`, {
// // //           headers,
// // //           responseType: 'blob',
// // //         })
// // //         .then((response) => {
// // //           const imageUrl = URL.createObjectURL(response.data);
// // //           setAvatar(imageUrl);
// // //         })
// // //         .catch((err) => {
// // //           console.error('Error fetching photo:', err);
// // //           setAvatar('/default-profile.jpg');
// // //         });
// // //     } else {
// // //       setAvatar('/default-profile.jpg');
// // //     }
// // //   }, [photoUrl, API_KEY]);

// // //   // Debug: Log punch entries
// // //   console.log(`Punch entries for ${name}:`, {
// // //     length: employeePunches.length,
// // //     punches: employeePunches,
// // //     firstPunchIn,
// // //     latestPunchOut,
// // //   });

// // //   const formatTime = (time) => {
// // //     if (!time) return '—';
// // //     try {
// // //       if (typeof time === 'string' && time.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
// // //         return time.slice(11, 16);
// // //       }
// // //       const date = new Date(time);
// // //       if (isNaN(date.getTime())) return '—';
// // //       const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
// // //       return istDate.toLocaleTimeString('en-IN', {
// // //         hour: '2-digit',
// // //         minute: '2-digit',
// // //         hour12: false,
// // //       });
// // //     } catch (error) {
// // //       console.error('Error formatting time:', time, error);
// // //       return '—';
// // //     }
// // //   };

// // //   const calculateTotalWorkHours = (punches) => {
// // //     let totalMs = 0;

// // //     punches.forEach((punch, index) => {
// // //       if (punch.punchin_time) {
// // //         const start = new Date(punch.punchin_time);
// // //         const end = punch.punchout_time ? new Date(punch.punchout_time) : new Date();

// // //         if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
// // //           totalMs += end - start;
// // //           const durationMinutes = Math.round((end - start) / (1000 * 60));
// // //           const hours = Math.floor(durationMinutes / 60);
// // //           const minutes = durationMinutes % 60;
// // //           console.log(
// // //             `Punch ${index + 1}: ${punch.punchin_time} to ${punch.punchout_time || 'now'} = ${hours}h ${minutes}m`
// // //           );
// // //         } else {
// // //           console.warn(`Invalid punch pair at index ${index}:`, punch);
// // //         }
// // //       } else {
// // //         console.warn(`Missing punchin_time at index ${index}:`, punch);
// // //       }
// // //     });

// // //     const totalMinutes = Math.round(totalMs / (1000 * 60));
// // //     const hours = Math.floor(totalMinutes / 60);
// // //     const minutes = totalMinutes % 60;

// // //     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// // //   };

// // //   const totalWorkHours = calculateTotalWorkHours(employeePunches);

// // //   return (
// // //     <div
// // //       className={cardClass}
// // //       onMouseEnter={() => setHovered(true)}
// // //       onMouseLeave={() => setHovered(false)}
// // //     >
// // //       <div className="hover-indicator">
// // //         <Eye size={16} />
// // //       </div>

// // //       <div className="card-main">
// // //         <div className="profile-section-admin">
// // //           <img src={avatar} alt="Profile" className="profile-img1" />
// // //           <div className="profile-info">
// // //             <span className="profile-name">{name}</span>
// // //           </div>
// // //         </div>

// // //         <hr className="divider" />

// // //         <div className="time-section-centered">
// // //           <div className="in-time">
// // //             <span className="label">In</span>
// // //             <span className="green">{formatTime(firstPunchIn)}</span>
// // //           </div>
// // //           <div className="total-hours-centered">
// // //             <span className="label">Totalhrs</span>
// // //             <span className="hours">{totalWorkHours}</span>
// // //           </div>
// // //           <div className="out-time">
// // //             <span className="label">Out</span>
// // //             <span className="red">{formatTime(latestPunchOut)}</span>
// // //           </div>
// // //         </div>

// // //         <hr className="divider" />
// // //       </div>

// // //       {hovered && (
// // //         <div className="card-popup">
// // //           <h4>Punch History</h4>
// // //           <div className="punch-history">
// // //             {employeePunches.map((entry, idx) => (
// // //               <div
// // //                 className="punch-entry"
// // //                 key={`${entry.punchin_time || idx}-${entry.punchout_time || idx}`}
// // //               >
// // //                 <div className="punch-details-grid">
// // //                   <div className="punch-detail">
// // //                     <strong>Punch In Time:</strong> {formatTime(entry.punchin_time)}
// // //                   </div>
// // //                   <div className="punch-detail">
// // //                     <strong>Punch Out Time:</strong> {formatTime(entry.punchout_time)}
// // //                   </div>
// // //                   <div className="punch-detail">
// // //                     <strong>Punch In Device:</strong> {entry.punchin_device || '—'}
// // //                   </div>
// // //                   <div className="punch-detail">
// // //                     <strong>Punch Out Device:</strong> {entry.punchout_device || '—'}
// // //                   </div>
// // //                   <div className="punch-detail">
// // //                     <strong>Punch In Location:</strong> {entry.punchin_location || '—'}
// // //                   </div>
// // //                   <div className="punch-detail">
// // //                     <strong>Punch Out Location:</strong> {entry.punchout_location || '—'}
// // //                   </div>
// // //                 </div>
// // //                 <hr />
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // const TimeSlotGroup = ({ time, slotKey, employeesData = [], isOpen, setSlotOpen }) => {
// // //   const handleToggle = () => {
// // //     setSlotOpen(slotKey, !isOpen);
// // //   };

// // //   return (
// // //     <div className="time-group">
// // //       <div className="time-header" onClick={handleToggle}>
// // //         <h3>{time}</h3>
// // //         <span className="expand-icon">{isOpen ? '˄' : '˅'}</span>
// // //       </div>
// // //       {isOpen && (
// // //         <div className="card-row">
// // //           {employeesData.map((empPunches, idx) => (
// // //             <EmployeeCardWithHover key={idx} employeePunches={empPunches} />
// // //           ))}
// // //         </div>
// // //       )}
// // //       <hr className="time-divider" />
// // //     </div>
// // //   );
// // // };

// // // const EmployeeLogin = () => {
// // //   const [activeTab, setActiveTab] = useState('today');
// // //   const [punchData, setPunchData] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {} });
// // //   const [selectedDate, setSelectedDate] = useState('');

// // //   useEffect(() => {
// // //     if (activeTab === 'select') return; // Skip fetching for select tab

// // //     const fetchPunchData = async () => {
// // //       setLoading(true);
// // //       setError(null);

// // //       try {
// // //         const API_KEY = process.env.REACT_APP_API_KEY;
// // //         const backendUrl = process.env.REACT_APP_BACKEND_URL;
// // //         const meId = JSON.parse(
// // //           localStorage.getItem("dashboardData") || "{}"
// // //         ).employeeId;
// // //         const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// // //         if (!API_KEY) throw new Error('API Key is missing.');
// // //         if (!backendUrl) throw new Error('Backend URL is missing.');

// // //         const response = await axios.get(`${backendUrl}/api/employeelogin/today-yesterday-punches`, {
// // //           headers,
// // //           withCredentials: true,
// // //         });

// // //         console.log('API Response:', response.data);

// // //         const data = Array.isArray(response.data)
// // //           ? response.data
// // //           : Array.isArray(response.data.data)
// // //           ? response.data.data
// // //           : [];

// // //         setPunchData(data);

// // //         const grouped = groupByDayAndEmployee(data);
// // //         const activeGroup = activeTab === 'today' ? grouped.Today : grouped.Yesterday;
// // //         const slots = groupByHourSlots(activeGroup);
// // //         const slotKeys = Object.keys(slots);
// // //         const newSlotStates = slotKeys.reduce(
// // //           (acc, slot, idx) => ({
// // //             ...acc,
// // //             [slot]: idx === 0,
// // //           }),
// // //           {}
// // //         );
// // //         setSlotStates((prev) => ({
// // //           ...prev,
// // //           [activeTab]: newSlotStates,
// // //         }));
// // //       } catch (err) {
// // //         console.error(err);
// // //         setError(err.response?.data?.message || err.message || 'Error fetching punch data.');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchPunchData();
// // //   }, [activeTab]);

// // //   const groupByDayAndEmployee = (data) => {
// // //     const grouped = { Today: {}, Yesterday: {} };

// // //     if (!Array.isArray(data)) return grouped;

// // //     data.forEach((record) => {
// // //       const day = record.record_day;
// // //       const empId = record.employee_id;

// // //       if (!grouped[day][empId]) {
// // //         grouped[day][empId] = [];
// // //       }
// // //       grouped[day][empId].push(record);
// // //     });

// // //     console.log('Grouped by Day and Employee:', grouped);
// // //     return grouped;
// // //   };

// // //   const groupByHourSlots = (activeGroup) => {
// // //     const slotMap = {};

// // //     Object.entries(activeGroup).forEach(([empId, punches]) => {
// // //       const sorted = [...punches].sort((a, b) => new Date(a.punchin_time) - new Date(b.punchin_time));
// // //       const firstPunch = sorted[0];

// // //       if (!firstPunch || !firstPunch.punchin_time) return;

// // //       const hour = new Date(firstPunch.punchin_time).getHours();
// // //       const slotLabel = `${hour}-${hour + 1}`;

// // //       if (!slotMap[slotLabel]) slotMap[slotLabel] = [];
// // //       slotMap[slotLabel].push(sorted);
// // //     });

// // //     console.log('Grouped by Hour Slots:', slotMap);
// // //     return slotMap;
// // //   };

// // //   const setSlotOpen = (slot, isOpen) => {
// // //     setSlotStates((prev) => ({
// // //       ...prev,
// // //       [activeTab]: {
// // //         ...prev[activeTab],
// // //         [slot]: isOpen,
// // //       },
// // //     }));
// // //   };

// // //   const handleDownload = async () => {
// // //     if (!selectedDate) {
// // //       setError('Please select a date to download punch data.');
// // //       return;
// // //     }

// // //     try {
// // //       const API_KEY = process.env.REACT_APP_API_KEY;
// // //       const backendUrl = process.env.REACT_APP_BACKEND_URL;
// // //       const meId = JSON.parse(
// // //         localStorage.getItem("dashboardData") || "{}"
// // //       ).employeeId;
// // //       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// // //       const response = await axios.get(
// // //         `${backendUrl}/api/employeelogin/punches?date=${selectedDate}`,
// // //         {
// // //           headers,
// // //           responseType: 'blob',
// // //         }
// // //       );

// // //       const url = window.URL.createObjectURL(new Blob([response.data]));
// // //       const link = document.createElement('a');
// // //       link.href = url;
// // //       link.setAttribute('download', `punch-data-${selectedDate}.csv`);
// // //       document.body.appendChild(link);
// // //       link.click();
// // //       document.body.removeChild(link);
// // //       window.URL.revokeObjectURL(url);
// // //     } catch (err) {
// // //       console.error('Error downloading punch data:', err);
// // //       setError('Failed to download punch data.');
// // //     }
// // //   };

// // //   const groupedData = groupByDayAndEmployee(punchData);
// // //   const activeGroup = activeTab === 'today' ? groupedData.Today : groupedData.Yesterday;
// // //   const slotGroupedData = groupByHourSlots(activeGroup);

// // //   return (
// // //     <div className="employee-login">
// // //       <h2 className="heading">Employee Punch Records</h2>

// // //       <div className="tab-buttons">
// // //         <button className={activeTab === 'today' ? 'active' : ''} onClick={() => setActiveTab('today')}>
// // //           Today
// // //         </button>
// // //         <button className={activeTab === 'yesterday' ? 'active' : ''} onClick={() => setActiveTab('yesterday')}>
// // //           Yesterday
// // //         </button>
// // //         <button className={activeTab === 'select' ? 'active' : ''} onClick={() => setActiveTab('select')}>
// // //           Select
// // //         </button>
// // //       </div>

// // //       {activeTab === 'select' && (
// // //         <div className="date-selection" style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
// // //           <input
// // //             type="date"
// // //             value={selectedDate}
// // //             onChange={(e) => setSelectedDate(e.target.value)}
// // //             style={{ padding: '8px', fontSize: '16px' }}
// // //           />
// // //           <button
// // //             onClick={handleDownload}
// // //             style={{
// // //               padding: '8px 16px',
// // //               backgroundColor: '#007bff',
// // //               color: 'white',
// // //               border: 'none',
// // //               borderRadius: '4px',
// // //               cursor: 'pointer',
// // //             }}
// // //           >
// // //             Download CSV
// // //           </button>
// // //         </div>
// // //       )}

// // //       {loading && activeTab !== 'select' && <p>Loading...</p>}
// // //       {error && <p style={{ color: 'red' }}>{error}</p>}

// // //       {!loading && !error && activeTab !== 'select' && (
// // //         <>
// // //           {Object.keys(slotGroupedData).length === 0 ? (
// // //             <p>No punch data available for {activeTab}.</p>
// // //           ) : (
// // //             Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
// // //               <TimeSlotGroup
// // //                 key={slot}
// // //                 time={`${slot} ${activeTab === 'today' ? '(Today)' : '(Yesterday)'}`}
// // //                 slotKey={slot}
// // //                 employeesData={empPunchesArr}
// // //                 isOpen={slotStates[activeTab][slot] || false}
// // //                 setSlotOpen={setSlotOpen}
// // //               />
// // //             ))
// // //           )}
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default EmployeeLogin;


// // // import React, { useEffect, useState } from 'react';
// // // import './EmployeeLogin.css';
// // // import { Eye } from 'lucide-react';
// // // import axios from 'axios';

// // // const EmployeeLogin = () => {
// // //   const [activeTab, setActiveTab] = useState('today');
// // //   const [punchData, setPunchData] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {} });
// // //   const [fromDate, setFromDate] = useState('');
// // //   const [toDate, setToDate] = useState('');

// // //   useEffect(() => {
// // //     if (activeTab === 'select') return; // Skip fetching for select tab

// // //     const fetchPunchData = async () => {
// // //       setLoading(true);
// // //       setError(null);

// // //       try {
// // //         const API_KEY = process.env.REACT_APP_API_KEY;
// // //         const backendUrl = process.env.REACT_APP_BACKEND_URL;
// // //         const meId = JSON.parse(
// // //           localStorage.getItem("dashboardData") || "{}"
// // //         ).employeeId;
// // //         const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// // //         if (!API_KEY) throw new Error('API Key is missing.');
// // //         if (!backendUrl) throw new Error('Backend URL is missing.');

// // //         const response = await axios.get(`${backendUrl}/api/employeelogin/today-yesterday-punches`, {
// // //           headers,
// // //           withCredentials: true,
// // //         });

// // //         console.log('API Response:', response.data);

// // //         const data = Array.isArray(response.data)
// // //           ? response.data
// // //           : Array.isArray(response.data.data)
// // //           ? response.data.data
// // //           : [];

// // //         setPunchData(data);

// // //         const grouped = groupByDayAndEmployee(data);
// // //         const activeGroup = activeTab === 'today' ? grouped.Today : grouped.Yesterday;
// // //         const slots = groupByHourSlots(activeGroup);
// // //         const slotKeys = Object.keys(slots);
// // //         const newSlotStates = slotKeys.reduce(
// // //           (acc, slot, idx) => ({
// // //             ...acc,
// // //             [slot]: idx === 0,
// // //           }),
// // //           {}
// // //         );
// // //         setSlotStates((prev) => ({
// // //           ...prev,
// // //           [activeTab]: newSlotStates,
// // //         }));
// // //       } catch (err) {
// // //         console.error(err);
// // //         setError(err.response?.data?.message || err.message || 'Error fetching punch data.');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchPunchData();
// // //   }, [activeTab]);

// // //   const groupByDayAndEmployee = (data) => {
// // //     const grouped = { Today: {}, Yesterday: {} };

// // //     if (!Array.isArray(data)) return grouped;

// // //     data.forEach((record) => {
// // //       const day = record.record_day;
// // //       const empId = record.employee_id;

// // //       if (!grouped[day][empId]) {
// // //         grouped[day][empId] = [];
// // //       }
// // //       grouped[day][empId].push(record);
// // //     });

// // //     console.log('Grouped by Day and Employee:', grouped);
// // //     return grouped;
// // //   };

// // //   const groupByHourSlots = (activeGroup) => {
// // //     const slotMap = {};

// // //     Object.entries(activeGroup).forEach(([empId, punches]) => {
// // //       const sorted = [...punches].sort((a, b) => new Date(a.punchin_time) - new Date(b.punchin_time));
// // //       const firstPunch = sorted[0];

// // //       if (!firstPunch || !firstPunch.punchin_time) return;

// // //       const hour = new Date(firstPunch.punchin_time).getHours();
// // //       const slotLabel = `${hour}-${hour + 1}`;

// // //       if (!slotMap[slotLabel]) slotMap[slotLabel] = [];
// // //       slotMap[slotLabel].push(sorted);
// // //     });

// // //     console.log('Grouped by Hour Slots:', slotMap);
// // //     return slotMap;
// // //   };

// // //   const setSlotOpen = (slot, isOpen) => {
// // //     setSlotStates((prev) => ({
// // //       ...prev,
// // //       [activeTab]: {
// // //         ...prev[activeTab],
// // //         [slot]: isOpen,
// // //       },
// // //     }));
// // //   };

// // //   const handleDownload = async () => {
// // //     if (!fromDate || !toDate) {
// // //       setError('Please select both From and To dates.');
// // //       return;
// // //     }

// // //     if (new Date(toDate) < new Date(fromDate)) {
// // //       setError('To date cannot be earlier than From date.');
// // //       return;
// // //     }

// // //     try {
// // //       const API_KEY = process.env.REACT_APP_API_KEY;
// // //       const backendUrl = process.env.REACT_APP_BACKEND_URL;
// // //       const meId = JSON.parse(
// // //         localStorage.getItem("dashboardData") || "{}"
// // //       ).employeeId;
// // //       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// // //       if (!API_KEY) throw new Error('API Key is missing.');
// // //       if (!backendUrl) throw new Error('Backend URL is missing.');
// // //       if (!meId) throw new Error('Employee ID is missing.');

// // //       const response = await axios.get(
// // //         `${backendUrl}/api/employeelogin/punches?from=${fromDate}&to=${toDate}`,
// // //         {
// // //           headers,
// // //           responseType: 'blob',
// // //         }
// // //       );

// // //       const url = window.URL.createObjectURL(new Blob([response.data]));
// // //       const link = document.createElement('a');
// // //       link.href = url;
// // //       link.setAttribute('download', `punch-data-${fromDate}-to-${toDate}.csv`);
// // //       document.body.appendChild(link);
// // //       link.click();
// // //       document.body.removeChild(link);
// // //       window.URL.revokeObjectURL(url);
// // //     } catch (err) {
// // //       console.error('Error downloading punch data:', err);
// // //       setError(
// // //         err.response?.status === 401
// // //           ? 'Unauthorized: Invalid API key or employee ID.'
// // //           : err.response?.data?.message || 'Failed to download punch data.'
// // //       );
// // //     }
// // //   };

// // //   const groupedData = groupByDayAndEmployee(punchData);
// // //   const activeGroup = activeTab === 'today' ? groupedData.Today : groupedData.Yesterday;
// // //   const slotGroupedData = groupByHourSlots(activeGroup);

// // //   return (
// // //     <div className="employee-login">
// // //       <h2 className="heading">Employee Punch Records</h2>

// // //       <div className="tab-buttons">
// // //         <button className={activeTab === 'today' ? 'active' : ''} onClick={() => setActiveTab('today')}>
// // //           Today
// // //         </button>
// // //         <button className={activeTab === 'yesterday' ? 'active' : ''} onClick={() => setActiveTab('yesterday')}>
// // //           Yesterday
// // //         </button>
// // //         <button className={activeTab === 'select' ? 'active' : ''} onClick={() => setActiveTab('select')}>
// // //           Select
// // //         </button>
// // //       </div>

// // //       {activeTab === 'select' && (
// // //         <div className="date-selection" style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
// // //           <div>
// // //             <label style={{ marginRight: '10px', fontWeight: 'bold' }}>From:</label>
// // //             <input
// // //               type="date"
// // //               value={fromDate}
// // //               onChange={(e) => setFromDate(e.target.value)}
// // //               style={{ padding: '8px', fontSize: '16px' }}
// // //             />
// // //           </div>
// // //           <div>
// // //             <label style={{ marginRight: '10px', fontWeight: 'bold' }}>To:</label>
// // //             <input
// // //               type="date"
// // //               value={toDate}
// // //               onChange={(e) => setToDate(e.target.value)}
// // //               style={{ padding: '8px', fontSize: '16px' }}
// // //             />
// // //           </div>
// // //           <button
// // //             onClick={handleDownload}
// // //             style={{
// // //               padding: '8px 16px',
// // //               backgroundColor: '#007bff',
// // //               color: 'white',
// // //               border: 'none',
// // //               borderRadius: '4px',
// // //               cursor: 'pointer',
// // //             }}
// // //           >
// // //             Download CSV
// // //           </button>
// // //         </div>
// // //       )}

// // //       {loading && activeTab !== 'select' && <p>Loading...</p>}
// // //       {error && <p style={{ color: 'red' }}>{error}</p>}

// // //       {!loading && !error && activeTab !== 'select' && (
// // //         <>
// // //           {Object.keys(slotGroupedData).length === 0 ? (
// // //             <p>No punch data available for {activeTab}.</p>
// // //           ) : (
// // //             Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
// // //               <TimeSlotGroup
// // //                 key={slot}
// // //                 time={`${slot} ${activeTab === 'today' ? '(Today)' : '(Yesterday)'}`}
// // //                 slotKey={slot}
// // //                 employeesData={empPunchesArr}
// // //                 isOpen={slotStates[activeTab][slot] || false}
// // //                 setSlotOpen={setSlotOpen}
// // //               />
// // //             ))
// // //           )}
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default EmployeeLogin;


// // import React, { useEffect, useState } from 'react';
// // import './EmployeeLogin.css';
// // import { Eye } from 'lucide-react';
// // import axios from 'axios';

// // const EmployeeCardWithHover = ({ employeePunches }) => {
// //   const [hovered, setHovered] = useState(false);
// //   const [avatar, setAvatar] = useState('/default-profile.jpg'); // Default avatar

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
// //   const meId = JSON.parse(
// //     localStorage.getItem("dashboardData") || "{}"
// //   ).employeeId;
// //   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //   // Determine card color based on latest location
// //   const isOfficeHQ =
// //     (latest.punchin_location && typeof latest.punchin_location === 'string' &&
// //      latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
// //     (latest.punchout_location && typeof latest.punchout_location === 'string' &&
// //      latest.punchout_location.trim().toLowerCase().includes('office hq'));
// //   console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
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
// //   const [fromDate, setFromDate] = useState(''); // Changed from selectedDate
// //   const [toDate, setToDate] = useState(''); // Added for "To" date

// //   useEffect(() => {
// //     if (activeTab === 'select') return; // Skip fetching for select tab

// //     const fetchPunchData = async () => {
// //       setLoading(true);
// //       setError(null);

// //       try {
// //         const API_KEY = process.env.REACT_APP_API_KEY;
// //         const backendUrl = process.env.REACT_APP_BACKEND_URL;
// //         const meId = JSON.parse(
// //           localStorage.getItem("dashboardData") || "{}"
// //         ).employeeId;
// //         const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

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

// //   const handleDownload = async () => {
// //     if (!fromDate || !toDate) {
// //       setError('Please select both "From" and "To" dates to download punch data.');
// //       return;
// //     }

// //     if (new Date(toDate) < new Date(fromDate)) {
// //       setError('"To" date must be on or after "From" date.');
// //       return;
// //     }

// //     try {
// //       const API_KEY = process.env.REACT_APP_API_KEY;
// //       const backendUrl = process.env.REACT_APP_BACKEND_URL;
// //       const meId = JSON.parse(
// //         localStorage.getItem("dashboardData") || "{}"
// //       ).employeeId;
// //       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //       const response = await axios.get(
// //         `${backendUrl}/api/employeelogin/punches?from=${fromDate}&to=${toDate}`,
// //         {
// //           headers,
// //           responseType: 'blob',
// //         }
// //       );

// //       const url = window.URL.createObjectURL(new Blob([response.data]));
// //       const link = document.createElement('a');
// //       link.href = url;
// //       link.setAttribute('download', `punch-data-${fromDate}-to-${toDate}.csv`);
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //       window.URL.revokeObjectURL(url);
// //     } catch (err) {
// //       console.error('Error downloading punch data:', err);
// //       setError('Failed to download punch data.');
// //     }
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
// //         <button className={activeTab === 'select' ? 'active' : ''} onClick={() => setActiveTab('select')}>
// //           Select
// //         </button>
// //       </div>

// //       {activeTab === 'select' && (
// //         <div className="date-selection" style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
// //           <div>
// //             <label htmlFor="fromDate" style={{ marginRight: '8px' }}>From:</label>
// //             <input
// //               id="fromDate"
// //               type="date"
// //               value={fromDate}
// //               onChange={(e) => setFromDate(e.target.value)}
// //               style={{ padding: '8px', fontSize: '16px' }}
// //             />
// //           </div>
// //           <div>
// //             <label htmlFor="toDate" style={{ marginRight: '8px' }}>To:</label>
// //             <input
// //               id="toDate"
// //               type="date"
// //               value={toDate}
// //               onChange={(e) => setToDate(e.target.value)}
// //               style={{ padding: '8px', fontSize: '16px' }}
// //             />
// //           </div>
// //           <button
// //             onClick={handleDownload}
// //             style={{
// //               padding: '8px 16px',
// //               backgroundColor: '#007bff',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '4px',
// //               cursor: 'pointer',
// //             }}
// //           >
// //             Download CSV
// //           </button>
// //         </div>
// //       )}

// //       {loading && activeTab !== 'select' && <p>Loading...</p>}
// //       {error && <p style={{ color: 'red' }}>{error}</p>}

// //       {!loading && !error && activeTab !== 'select' && (
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

// // import React, { useEffect, useState } from 'react';
// // import './EmployeeLogin.css';
// // import { Eye } from 'lucide-react';
// // import axios from 'axios';

// // const EmployeeCardWithHover = ({ employeePunches }) => {
// //   const [hovered, setHovered] = useState(false);
// //   const [avatar, setAvatar] = useState('/default-profile.jpg');

// //   if (!employeePunches || !Array.isArray(employeePunches) || employeePunches.length === 0) {
// //     return <div className="employee-card-hover">No punch data available</div>;
// //   }

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
// //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
// //   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //   const isOfficeHQ =
// //     (latest.punchin_location &&
// //       typeof latest.punchin_location === 'string' &&
// //       latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
// //     (latest.punchout_location &&
// //       typeof latest.punchout_location === 'string' &&
// //       latest.punchout_location.trim().toLowerCase().includes('office hq'));
// //   console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
// //     punchin_location: latest.punchin_location,
// //     punchout_location: latest.punchout_location,
// //   });
// //   const cardClass = isOfficeHQ
// //     ? 'employee-card-hover bg-office-hq'
// //     : 'employee-card-hover bg-default';

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
// //   }, [photoUrl]);

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
// //         } else {
// //           console.warn(`Invalid punch pair at index ${index}:`, punch);
// //         }
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
// //   const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {}, select: {} });
// //   const [fromDate, setFromDate] = useState('');
// //   const [toDate, setToDate] = useState('');

// //   useEffect(() => {
// //     const fetchPunchData = async () => {
// //       setLoading(true);
// //       setError(null);

// //       try {
// //         const API_KEY = process.env.REACT_APP_API_KEY;
// //         const backendUrl = process.env.REACT_APP_BACKEND_URL;
// //         const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
// //         const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //         if (!API_KEY) throw new Error('API Key is missing.');
// //         if (!backendUrl) throw new Error('Backend URL is missing.');
// //         if (!meId) throw new Error('Employee ID is missing.');

// //         let url = `${backendUrl}/api/employeelogin/today-yesterday-punches`;
// //         if (activeTab === 'select' && fromDate && toDate) {
// //           url = `${backendUrl}/api/employeelogin/punches?from=${fromDate}&to=${toDate}`;
// //         } else if (activeTab === 'select') {
// //           setPunchData([]);
// //           setLoading(false);
// //           return;
// //         }

// //         console.log('Fetching punch data from:', url, { headers });
// //         const response = await axios.get(url, {
// //           headers,
// //           withCredentials: true,
// //         });

// //         console.log('Punch data response:', response.data);

// //         const data = Array.isArray(response.data)
// //           ? response.data
// //           : Array.isArray(response.data.data)
// //           ? response.data.data
// //           : [];

// //         setPunchData(data);

// //         const grouped = groupByDayAndEmployee(data, activeTab);
// //         const activeGroup = activeTab === 'today' ? grouped.Today : activeTab === 'yesterday' ? grouped.Yesterday : grouped[fromDate] || {};
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
// //         console.error('Error fetching punch data:', {
// //           message: err.message,
// //           status: err.response?.status,
// //           data: err.response?.data,
// //         });
// //         setError(err.response?.data?.message || err.message || 'Error fetching punch data.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchPunchData();
// //   }, [activeTab, fromDate, toDate]);

// //   const groupByDayAndEmployee = (data, tab) => {
// //     const grouped = { Today: {}, Yesterday: {} };

// //     if (!Array.isArray(data)) return grouped;

// //     if (tab === 'select') {
// //       grouped[fromDate] = {};
// //       data.forEach((record) => {
// //         const date = new Date(record.punchin_time).toISOString().split('T')[0];
// //         const empId = record.employee_id;

// //         if (!grouped[date]) grouped[date] = {};
// //         if (!grouped[date][empId]) grouped[date][empId] = [];
// //         grouped[date][empId].push(record);
// //       });
// //     } else {
// //       data.forEach((record) => {
// //         const day = record.record_day;
// //         const empId = record.employee_id;

// //         if (!grouped[day]) grouped[day] = {};
// //         if (!grouped[day][empId]) grouped[day][empId] = [];
// //         grouped[day][empId].push(record);
// //       });
// //     }

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

// //   const handleDownload = async () => {
// //     if (!fromDate || !toDate) {
// //       setError('Please select both "From" and "To" dates to download punch data.');
// //       return;
// //     }

// //     if (new Date(toDate) < new Date(fromDate)) {
// //       setError('"To" date must be on or after "From" date.');
// //       return;
// //     }

// //     setError(null);
// //     setLoading(true);

// //     try {
// //       const API_KEY = process.env.REACT_APP_API_KEY;
// //       const backendUrl = process.env.REACT_APP_BACKEND_URL;
// //       const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
// //       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //       if (!API_KEY) throw new Error('API Key is missing.');
// //       if (!backendUrl) throw new Error('Backend URL is missing.');
// //       if (!meId) throw new Error('Employee ID is missing.');

// //       const url = `${backendUrl}/api/emp-excelsheet?from=${fromDate}&to=${toDate}`;
// //       console.log('Downloading Excel from:', url, { headers });

// //       const response = await axios.get(url, {
// //         headers,
// //         withCredentials: true,
// //         responseType: 'blob',
// //       });

// //       console.log('Download response:', {
// //         status: response.status,
// //         headers: response.headers,
// //         contentType: response.headers['content-type'],
// //       });

// //       // Verify content type
// //       const contentType = response.headers['content-type'];
// //       if (!contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
// //         const text = await response.data.text();
// //         try {
// //           const parsed = JSON.parse(text);
// //           throw new Error(parsed.message || 'Unexpected response format');
// //         } catch (parseErr) {
// //           throw new Error('Response is not an Excel file');
// //         }
// //       }

// //       const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
// //       const link = document.createElement('a');
// //       link.href = downloadUrl;
// //       link.setAttribute('download', `punch-data-${fromDate}-to-${toDate}.xlsx`);
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //       window.URL.revokeObjectURL(downloadUrl);
// //     } catch (err) {
// //       console.error('Error downloading punch data:', {
// //         message: err.message,
// //         status: err.response?.status,
// //         data: err.response?.data,
// //         headers: err.response?.headers,
// //       });

// //       let errorMessage = err.response?.data?.message || err.message || 'Failed to download punch data.';
// //       if (err.response?.data instanceof Blob) {
// //         try {
// //           const text = await err.response.data.text();
// //           const parsed = JSON.parse(text);
// //           errorMessage = parsed.message || errorMessage;
// //         } catch (parseErr) {
// //           console.warn('Could not parse error response:', parseErr);
// //         }
// //       }

// //       setError(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const groupedData = groupByDayAndEmployee(punchData, activeTab);
// //   const activeGroup = activeTab === 'today' ? groupedData.Today : activeTab === 'yesterday' ? groupedData.Yesterday : groupedData[fromDate] || {};
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
// //         <button className={activeTab === 'select' ? 'active' : ''} onClick={() => setActiveTab('select')}>
// //           Select
// //         </button>
// //       </div>

// //       {activeTab === 'select' && (
// //         <div className="date-selection" style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
// //           <div>
// //             <label htmlFor="fromDate" style={{ marginRight: '8px' }}>From:</label>
// //             <input
// //               id="fromDate"
// //               type="date"
// //               value={fromDate}
// //               onChange={(e) => setFromDate(e.target.value)}
// //               style={{ padding: '8px', fontSize: '16px' }}
// //             />
// //           </div>
// //           <div>
// //             <label htmlFor="toDate" style={{ marginRight: '8px' }}>To:</label>
// //             <input
// //               id="toDate"
// //               type="date"
// //               value={toDate}
// //               onChange={(e) => setToDate(e.target.value)}
// //               style={{ padding: '8px', fontSize: '16px' }}
// //             />
// //           </div>
// //           <button
// //             onClick={handleDownload}
// //             disabled={loading}
// //             style={{
// //               padding: '8px 16px',
// //               backgroundColor: loading ? '#ccc' : '#007bff',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '4px',
// //               cursor: loading ? 'not-allowed' : 'pointer',
// //             }}
// //           >
// //             {loading ? 'Downloading...' : 'Download Excel'}
// //           </button>
// //         </div>
// //       )}

// //       {loading && <p>Loading...</p>}
// //       {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

// //       {!loading && !error && (
// //         <>
// //           {Object.keys(slotGroupedData).length === 0 ? (
// //             <p>No punch data available for {activeTab === 'select' ? `${fromDate} to ${toDate}` : activeTab}.</p>
// //           ) : (
// //             Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
// //               <TimeSlotGroup
// //                 key={slot}
// //                 time={`${slot} ${activeTab === 'today' ? '(Today)' : activeTab === 'yesterday' ? '(Yesterday)' : `(${fromDate})`}`}
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

// // import React, { useEffect, useState } from 'react';
// // import './EmployeeLogin.css';
// // import { Eye } from 'lucide-react';
// // import axios from 'axios';

// // const EmployeeCardWithHover = ({ employeePunches }) => {
// //   const [hovered, setHovered] = useState(false);
// //   const [avatar, setAvatar] = useState('/default-profile.jpg');

// //   if (!employeePunches || !Array.isArray(employeePunches) || employeePunches.length === 0) {
// //     return <div className="employee-card-hover">No punch data available</div>;
// //   }

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
// //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
// //   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //   const isOfficeHQ =
// //     (latest.punchin_location &&
// //       typeof latest.punchin_location === 'string' &&
// //       latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
// //     (latest.punchout_location &&
// //       typeof latest.punchout_location === 'string' &&
// //       latest.punchout_location.trim().toLowerCase().includes('office hq'));
// //   console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
// //     punchin_location: latest.punchin_location,
// //     punchout_location: latest.punchout_location,
// //   });
// //   const cardClass = isOfficeHQ
// //     ? 'employee-card-hover bg-office-hq'
// //     : 'employee-card-hover bg-default';

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
// //   }, [photoUrl]);

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
// //         } else {
// //           console.warn(`Invalid punch pair at index ${index}:`, punch);
// //         }
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
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {}, select: {} });
// //   const [fromDate, setFromDate] = useState('');
// //   const [toDate, setToDate] = useState('');

// //   useEffect(() => {
// //     const fetchPunchData = async () => {
// //       if (activeTab === 'select' && (!fromDate || !toDate)) {
// //         setPunchData([]);
// //         setLoading(false);
// //         return;
// //       }

// //       setLoading(true);
// //       setError(null);

// //       try {
// //         const API_KEY = process.env.REACT_APP_API_KEY;
// //         const backendUrl = process.env.REACT_APP_BACKEND_URL;
// //         const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
// //         const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //         if (!API_KEY) throw new Error('API Key is missing.');
// //         if (!backendUrl) throw new Error('Backend URL is missing.');
// //         if (!meId) throw new Error('Employee ID is missing.');

// //         let url = `${backendUrl}/api/employeelogin/today-yesterday-punches`;
// //         if (activeTab === 'select') {
// //           url = `${backendUrl}/api/employeelogin/punches?from=${fromDate}&to=${toDate}`;
// //         }

// //         console.log('Fetching punch data from:', url, { headers });
// //         const response = await axios.get(url, {
// //           headers,
// //           withCredentials: true,
// //         });

// //         console.log('Punch data response:', response.data);

// //         const data = Array.isArray(response.data)
// //           ? response.data
// //           : Array.isArray(response.data.data)
// //           ? response.data.data
// //           : [];

// //         setPunchData(data);

// //         const grouped = groupByDayAndEmployee(data, activeTab);
// //         const activeGroup = activeTab === 'today' ? grouped.Today : activeTab === 'yesterday' ? grouped.Yesterday : grouped[fromDate] || {};
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
// //         console.error('Error fetching punch data:', {
// //           message: err.message,
// //           status: err.response?.status,
// //           data: err.response?.data,
// //         });
// //         let errorMessage = err.response?.data?.message || err.message || 'Error fetching punch data.';
// //         if (err.response?.data instanceof Blob) {
// //           try {
// //             const text = await err.response.data.text();
// //             const parsed = JSON.parse(text);
// //             errorMessage = parsed.message || errorMessage;
// //           } catch (parseErr) {
// //             console.warn('Could not parse error response:', parseErr);
// //           }
// //         }
// //         setError(errorMessage);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchPunchData();
// //   }, [activeTab, fromDate, toDate]);

// //   const groupByDayAndEmployee = (data, tab) => {
// //     const grouped = { Today: {}, Yesterday: {} };

// //     if (!Array.isArray(data)) return grouped;

// //     if (tab === 'select') {
// //       data.forEach((record) => {
// //         if (!record.punchin_time || !record.employee_id) return;
// //         const date = new Date(record.punchin_time).toISOString().split('T')[0];
// //         const empId = record.employee_id;

// //         if (!grouped[date]) grouped[date] = {};
// //         if (!grouped[date][empId]) grouped[date][empId] = [];
// //         grouped[date][empId].push(record);
// //       });
// //     } else {
// //       data.forEach((record) => {
// //         if (!record.record_day || !record.employee_id) return;
// //         const day = record.record_day;
// //         const empId = record.employee_id;

// //         if (!grouped[day]) grouped[day] = {};
// //         if (!grouped[day][empId]) grouped[day][empId] = [];
// //         grouped[day][empId].push(record);
// //       });
// //     }

// //     console.log('Grouped by Day and Employee:', grouped);
// //     return grouped;
// //   };

// //   const groupByHourSlots = (activeGroup) => {
// //     const slotMap = {};

// //     Object.entries(activeGroup).forEach(([empId, punches]) => {
// //       const sorted = [...punches].sort((a, b) => new Date(a.punchin_time) - new Date(b.punchin_time));
// //       const firstPunch = sorted[0];

// //       if (!firstPunch || !firstPunch.punchin_time) {
// //         console.warn(`Skipping punches for employee ${empId}: invalid punchin_time`);
// //         return;
// //       }

// //       const punchDate = new Date(firstPunch.punchin_time);
// //       if (isNaN(punchDate.getTime())) {
// //         console.warn(`Invalid punchin_time for employee ${empId}:`, firstPunch.punchin_time);
// //         return;
// //       }

// //       const hour = punchDate.getHours();
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

// //   const handleDownload = async () => {
// //     if (!fromDate || !toDate) {
// //       setError('Please select both "From" and "To" dates to download punch data.');
// //       return;
// //     }

// //     if (new Date(toDate) < new Date(fromDate)) {
// //       setError('"To" date must be on or after "From" date.');
// //       return;
// //     }

// //     setError(null);
// //     setLoading(true);

// //     try {
// //       const API_KEY = process.env.REACT_APP_API_KEY;
// //       const backendUrl = process.env.REACT_APP_BACKEND_URL;
// //       const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
// //       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //       if (!API_KEY) throw new Error('API Key is missing.');
// //       if (!backendUrl) throw new Error('Backend URL is missing.');
// //       if (!meId) throw new Error('Employee ID is missing.');

// //       const url = `${backendUrl}/api/emp-excelsheet?from=${fromDate}&to=${toDate}`;
// //       console.log('Downloading Excel from:', url, { headers, employeeId: meId });

// //       const response = await axios.get(url, {
// //         headers,
// //         withCredentials: true,
// //         responseType: 'blob',
// //       });

// //       console.log('Download response:', {
// //         status: response.status,
// //         headers: response.headers,
// //         contentType: response.headers['content-type'],
// //       });

// //       const contentType = response.headers['content-type'];
// //       if (!contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
// //         const text = await response.data.text();
// //         let errorMessage = 'Unexpected response format';
// //         try {
// //           const parsed = JSON.parse(text);
// //           errorMessage = parsed.message || errorMessage;
// //         } catch (parseErr) {
// //           console.warn('Could not parse error response:', parseErr, 'Response text:', text);
// //         }
// //         throw new Error(errorMessage);
// //       }

// //       const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
// //       const link = document.createElement('a');
// //       link.href = downloadUrl;
// //       link.setAttribute('download', `punch-data-${fromDate}-to-${toDate}.xlsx`);
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //       window.URL.revokeObjectURL(downloadUrl);
// //     } catch (err) {
// //       console.error('Error downloading punch data:', {
// //         message: err.message,
// //         status: err.response?.status,
// //         headers: err.response?.headers,
// //       });

// //       let errorMessage = err.message || 'Failed to download punch data.';
// //       if (err.response?.data instanceof Blob) {
// //         try {
// //           const text = await err.response.data.text();
// //           console.log('Error response text:', text);
// //           const parsed = JSON.parse(text);
// //           errorMessage = parsed.message || errorMessage;
// //         } catch (parseErr) {
// //           console.warn('Could not parse error response:', parseErr);
// //         }
// //       }

// //       setError(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const groupedData = groupByDayAndEmployee(punchData, activeTab);
// //   const activeGroup = activeTab === 'today' ? groupedData.Today : activeTab === 'yesterday' ? groupedData.Yesterday : groupedData[fromDate] || {};
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
// //         <button className={activeTab === 'select' ? 'active' : ''} onClick={() => setActiveTab('select')}>
// //           Select
// //         </button>
// //       </div>

// //       {activeTab === 'select' && (
// //         <div className="date-selection" style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
// //           <div>
// //             <label htmlFor="fromDate" style={{ marginRight: '8px' }}>From:</label>
// //             <input
// //               id="fromDate"
// //               type="date"
// //               value={fromDate}
// //               onChange={(e) => setFromDate(e.target.value)}
// //               style={{ padding: '8px', fontSize: '16px' }}
// //             />
// //           </div>
// //           <div>
// //             <label htmlFor="toDate" style={{ marginRight: '8px' }}>To:</label>
// //             <input
// //               id="toDate"
// //               type="date"
// //               value={toDate}
// //               onChange={(e) => setToDate(e.target.value)}
// //               style={{ padding: '8px', fontSize: '16px' }}
// //             />
// //           </div>
// //           <button
// //             onClick={handleDownload}
// //             disabled={loading}
// //             style={{
// //               padding: '8px 16px',
// //               backgroundColor: loading ? '#ccc' : '#007bff',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '4px',
// //               cursor: loading ? 'not-allowed' : 'pointer',
// //             }}
// //           >
// //             {loading ? 'Downloading...' : 'Download Excel'}
// //           </button>
// //         </div>
// //       )}

// //       {loading && <p>Loading...</p>}
// //       {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

// //       {!loading && !error && (
// //         <>
// //           {Object.keys(slotGroupedData).length === 0 ? (
// //             <p>No punch data available for {activeTab === 'select' ? `${fromDate} to ${toDate}` : activeTab}.</p>
// //           ) : (
// //             Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
// //               <TimeSlotGroup
// //                 key={slot}
// //                 time={`${slot} ${activeTab === 'today' ? '(Today)' : activeTab === 'yesterday' ? '(Yesterday)' : `(${fromDate})`}`}
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


// // import React, { useEffect, useState } from 'react';
// // import './EmployeeLogin.css';
// // import { Eye } from 'lucide-react';
// // import axios from 'axios';

// // const EmployeeCardWithHover = ({ employeePunches }) => {
// //   const [hovered, setHovered] = useState(false);
// //   const [avatar, setAvatar] = useState('/default-profile.jpg');

// //   if (!employeePunches || !Array.isArray(employeePunches) || employeePunches.length === 0) {
// //     return <div className="employee-card-hover">No punch data available</div>;
// //   }

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
// //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
// //   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //   const isOfficeHQ =
// //     (latest.punchin_location &&
// //       typeof latest.punchin_location === 'string' &&
// //       latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
// //     (latest.punchout_location &&
// //       typeof latest.punchout_location === 'string' &&
// //       latest.punchout_location.trim().toLowerCase().includes('office hq'));
// //   console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
// //     punchin_location: latest.punchin_location,
// //     punchout_location: latest.punchout_location,
// //   });
// //   const cardClass = isOfficeHQ
// //     ? 'employee-card-hover bg-office-hq'
// //     : 'employee-card-hover bg-default';

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
// //   }, [photoUrl]);

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
// //         } else {
// //           console.warn(`Invalid punch pair at index ${index}:`, punch);
// //         }
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
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {}, select: {} });
// //   const [fromDate, setFromDate] = useState('');
// //   const [toDate, setToDate] = useState('');
// //   const [dateError, setDateError] = useState(null); // New state for date range validation

// //   // Function to validate date range (max 5 days)
// //   const validateDateRange = (from, to) => {
// //     if (!from || !to) return true; // No error if either date is not set
// //     const fromDateObj = new Date(from);
// //     const toDateObj = new Date(to);
// //     const diffTime = toDateObj - fromDateObj;
// //     const diffDays = diffTime / (1000 * 60 * 60 * 24);
// //     return diffDays >= 0 && diffDays <= 5; // Allow same day (0) up to 5 days
// //   };

// //   useEffect(() => {
// //     const fetchPunchData = async () => {
// //       if (activeTab === 'select' && (!fromDate || !toDate)) {
// //         setPunchData([]);
// //         setLoading(false);
// //         return;
// //       }

// //       // Validate date range for 'select' tab
// //       if (activeTab === 'select' && !validateDateRange(fromDate, toDate)) {
// //         setError('Date range must not exceed 5 days.');
// //         setPunchData([]);
// //         setLoading(false);
// //         return;
// //       }

// //       setLoading(true);
// //       setError(null);
// //       setDateError(null);

// //       try {
// //         const API_KEY = process.env.REACT_APP_API_KEY;
// //         const backendUrl = process.env.REACT_APP_BACKEND_URL;
// //         const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
// //         const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //         if (!API_KEY) throw new Error('API Key is missing.');
// //         if (!backendUrl) throw new Error('Backend URL is missing.');
// //         if (!meId) throw new Error('Employee ID is missing.');

// //         let url = `${backendUrl}/api/employeelogin/today-yesterday-punches`;
// //         if (activeTab === 'select') {
// //           url = `${backendUrl}/api/employeelogin/punches?from=${fromDate}&to=${toDate}`;
// //         }

// //         console.log('Fetching punch data from:', url, { headers });
// //         const response = await axios.get(url, {
// //           headers,
// //           withCredentials: true,
// //         });

// //         console.log('Punch data response:', response.data);

// //         const data = Array.isArray(response.data)
// //           ? response.data
// //           : Array.isArray(response.data.data)
// //           ? response.data.data
// //           : [];

// //         setPunchData(data);

// //         const grouped = groupByDayAndEmployee(data, activeTab);
// //         const activeGroup = activeTab === 'today' ? grouped.Today : activeTab === 'yesterday' ? grouped.Yesterday : grouped[fromDate] || {};
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
// //         console.error('Error fetching punch data:', {
// //           message: err.message,
// //           status: err.response?.status,
// //           data: err.response?.data,
// //         });
// //         let errorMessage = err.response?.data?.message || err.message || 'Error fetching punch data.';
// //         if (err.response?.data instanceof Blob) {
// //           try {
// //             const text = await err.response.data.text();
// //             const parsed = JSON.parse(text);
// //             errorMessage = parsed.message || errorMessage;
// //           } catch (parseErr) {
// //             console.warn('Could not parse error response:', parseErr);
// //           }
// //         }
// //         setError(errorMessage);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchPunchData();
// //   }, [activeTab, fromDate, toDate]);

// //   const groupByDayAndEmployee = (data, tab) => {
// //     const grouped = { Today: {}, Yesterday: {} };

// //     if (!Array.isArray(data)) return grouped;

// //     if (tab === 'select') {
// //       data.forEach((record) => {
// //         if (!record.punchin_time || !record.employee_id) return;
// //         const date = new Date(record.punchin_time).toISOString().split('T')[0];
// //         const empId = record.employee_id;

// //         if (!grouped[date]) grouped[date] = {};
// //         if (!grouped[date][empId]) grouped[date][empId] = [];
// //         grouped[date][empId].push(record);
// //       });
// //     } else {
// //       data.forEach((record) => {
// //         if (!record.record_day || !record.employee_id) return;
// //         const day = record.record_day;
// //         const empId = record.employee_id;

// //         if (!grouped[day]) grouped[day] = {};
// //         if (!grouped[day][empId]) grouped[day][empId] = [];
// //         grouped[day][empId].push(record);
// //       });
// //     }

// //     console.log('Grouped by Day and Employee:', grouped);
// //     return grouped;
// //   };

// //   const groupByHourSlots = (activeGroup) => {
// //     const slotMap = {};

// //     Object.entries(activeGroup).forEach(([empId, punches]) => {
// //       const sorted = [...punches].sort((a, b) => new Date(a.punchin_time) - new Date(b.punchin_time));
// //       const firstPunch = sorted[0];

// //       if (!firstPunch || !firstPunch.punchin_time) {
// //         console.warn(`Skipping punches for employee ${empId}: invalid punchin_time`);
// //         return;
// //       }

// //       const punchDate = new Date(firstPunch.punchin_time);
// //       if (isNaN(punchDate.getTime())) {
// //         console.warn(`Invalid punchin_time for employee ${empId}:`, firstPunch.punchin_time);
// //         return;
// //       }

// //       const hour = punchDate.getHours();
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

// //   const handleDownload = async () => {
// //     if (!fromDate || !toDate) {
// //       setError('Please select both "From" and "To" dates to download punch data.');
// //       return;
// //     }

// //     if (new Date(toDate) < new Date(fromDate)) {
// //       setError('"To" date must be on or after "From" date.');
// //       return;
// //     }

// //     if (!validateDateRange(fromDate, toDate)) {
// //       setError('Date range must not exceed 5 days.');
// //       return;
// //     }

// //     setError(null);
// //     setLoading(true);

// //     try {
// //       const API_KEY = process.env.REACT_APP_API_KEY;
// //       const backendUrl = process.env.REACT_APP_BACKEND_URL;
// //       const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
// //       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //       if (!API_KEY) throw new Error('API Key is missing.');
// //       if (!backendUrl) throw new Error('Backend URL is missing.');
// //       if (!meId) throw new Error('Employee ID is missing.');

// //       const url = `${backendUrl}/api/emp-excelsheet?from=${fromDate}&to=${toDate}`;
// //       console.log('Downloading Excel from:', url, { headers, employeeId: meId });

// //       const response = await axios.get(url, {
// //         headers,
// //         withCredentials: true,
// //         responseType: 'blob',
// //       });

// //       console.log('Download response:', {
// //         status: response.status,
// //         headers: response.headers,
// //         contentType: response.headers['content-type'],
// //       });

// //       const contentType = response.headers['content-type'];
// //       if (!contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
// //         const text = await response.data.text();
// //         let errorMessage = 'Unexpected response format';
// //         try {
// //           const parsed = JSON.parse(text);
// //           errorMessage = parsed.message || errorMessage;
// //         } catch (parseErr) {
// //           console.warn('Could not parse error response:', parseErr, 'Response text:', text);
// //         }
// //         throw new Error(errorMessage);
// //       }

// //       const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
// //       const link = document.createElement('a');
// //       link.href = downloadUrl;
// //       link.setAttribute('download', `punch-data-${fromDate}-to-${toDate}.xlsx`);
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //       window.URL.revokeObjectURL(downloadUrl);
// //     } catch (err) {
// //       console.error('Error downloading punch data:', {
// //         message: err.message,
// //         status: err.response?.status,
// //         headers: err.response?.headers,
// //       });

// //       let errorMessage = err.message || 'Failed to download punch data.';
// //       if (err.response?.data instanceof Blob) {
// //         try {
// //           const text = await err.response.data.text();
// //           console.log('Error response text:', text);
// //           const parsed = JSON.parse(text);
// //           errorMessage = parsed.message || errorMessage;
// //         } catch (parseErr) {
// //           console.warn('Could not parse error response:', parseErr);
// //         }
// //       }

// //       setError(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Handle date changes with validation
// //   const handleFromDateChange = (e) => {
// //     const newFromDate = e.target.value;
// //     setFromDate(newFromDate);
// //     if (toDate && !validateDateRange(newFromDate, toDate)) {
// //       setDateError('Date range must not exceed 5 days.');
// //     } else {
// //       setDateError(null);
// //     }
// //   };

// //   const handleToDateChange = (e) => {
// //     const newToDate = e.target.value;
// //     setToDate(newToDate);
// //     if (fromDate && !validateDateRange(fromDate, newToDate)) {
// //       setDateError('Date range must not exceed 5 days.');
// //     } else {
// //       setDateError(null);
// //     }
// //   };

// //   const groupedData = groupByDayAndEmployee(punchData, activeTab);
// //   const activeGroup = activeTab === 'today' ? groupedData.Today : activeTab === 'yesterday' ? groupedData.Yesterday : groupedData[fromDate] || {};
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
// //         <button className={activeTab === 'select' ? 'active' : ''} onClick={() => setActiveTab('select')}>
// //           Select
// //         </button>
// //       </div>

// //       {activeTab === 'select' && (
// //         <div className="date-selection" style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
// //           <div>
// //             <label htmlFor="fromDate" style={{ marginRight: '8px' }}>From:</label>
// //             <input
// //               id="fromDate"
// //               type="date"
// //               value={fromDate}
// //               onChange={handleFromDateChange}
// //               style={{ padding: '8px', fontSize: '16px' }}
// //             />
// //           </div>
// //           <div>
// //             <label htmlFor="toDate" style={{ marginRight: '8px' }}>To:</label>
// //             <input
// //               id="toDate"
// //               type="date"
// //               value={toDate}
// //               onChange={handleToDateChange}
// //               style={{ padding: '8px', fontSize: '16px' }}
// //             />
// //           </div>
// //           <button
// //             onClick={handleDownload}
// //             disabled={loading || dateError || !fromDate || !toDate}
// //             style={{
// //               padding: '8px 16px',
// //               backgroundColor: loading || dateError || !fromDate || !toDate ? '#ccc' : '#007bff',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '4px',
// //               cursor: loading || dateError || !fromDate || !toDate ? 'not-allowed' : 'pointer',
// //             }}
// //           >
// //             {loading ? 'Downloading...' : 'Download Excel'}
// //           </button>
// //         </div>
// //       )}

// //       {dateError && <p style={{ color: 'red', fontWeight: 'bold' }}>{dateError}</p>}
// //       {loading && <p>Loading...</p>}
// //       {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

// //       {!loading && !error && (
// //         <>
// //           {Object.keys(slotGroupedData).length === 0 ? (
// //             <p>No punch data available for {activeTab === 'select' ? `${fromDate} to ${toDate}` : activeTab}.</p>
// //           ) : (
// //             Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
// //               <TimeSlotGroup
// //                 key={slot}
// //                 time={`${slot} ${activeTab === 'today' ? '(Today)' : activeTab === 'yesterday' ? '(Yesterday)' : `(${fromDate})`}`}
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
//   const [avatar, setAvatar] = useState('/default-profile.jpg');

//   if (!employeePunches || !Array.isArray(employeePunches) || employeePunches.length === 0) {
//     return <div className="employee-card-hover">No punch data available</div>;
//   }

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
//   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
//   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

//   const isOfficeHQ =
//     (latest.punchin_location &&
//       typeof latest.punchin_location === 'string' &&
//       latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
//     (latest.punchout_location &&
//       typeof latest.punchout_location === 'string' &&
//       latest.punchout_location.trim().toLowerCase().includes('office hq'));
//   console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
//     punchin_location: latest.punchin_location,
//     punchout_location: latest.punchout_location,
//   });
//   const cardClass = isOfficeHQ
//     ? 'employee-card-hover bg-office-hq'
//     : 'employee-card-hover bg-default';

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
//   }, [photoUrl]);

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
//         } else {
//           console.warn(`Invalid punch pair at index ${index}:`, punch);
//         }
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
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {}, select: {} });
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [dateError, setDateError] = useState(null);

//   // Function to validate date range (max 5 days)
//   const validateDateRange = (from, to) => {
//     if (!from || !to) return true; // No error if either date is not set
//     const fromDateObj = new Date(from);
//     const toDateObj = new Date(to);
//     const diffTime = toDateObj - fromDateObj;
//     const diffDays = diffTime / (1000 * 60 * 60 * 24);
//     return diffDays >= 0 && diffDays <= 5; // Allow same day (0) up to 5 days
//   };

//   useEffect(() => {
//     const fetchPunchData = async () => {
//       // Skip fetching for 'select' tab until both dates are set and valid
//       if (activeTab === 'select' && (!fromDate || !toDate)) {
//         setPunchData([]); // Clear punch data to avoid stale data
//         setLoading(false);
//         setError(null);
//         return;
//       }

//       // Validate date range for 'select' tab
//       if (activeTab === 'select' && !validateDateRange(fromDate, toDate)) {
//         setError('Date range must not exceed 5 days.');
//         setPunchData([]);
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError(null);
//       setDateError(null);

//       try {
//         const API_KEY = process.env.REACT_APP_API_KEY;
//         const backendUrl = process.env.REACT_APP_BACKEND_URL;
//         const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
//         const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

//         if (!API_KEY) throw new Error('API Key is missing.');
//         if (!backendUrl) throw new Error('Backend URL is missing.');
//         if (!meId) throw new Error('Employee ID is missing.');

//         let url = `${backendUrl}/api/employeelogin/today-yesterday-punches`;
//         if (activeTab === 'select') {
//           url = `${backendUrl}/api/employeelogin/punches?from=${fromDate}&to=${toDate}`;
//         }

//         console.log('Fetching punch data from:', url, { headers });
//         const response = await axios.get(url, {
//           headers,
//           withCredentials: true,
//         });

//         console.log('Punch data response:', response.data);

//         const data = Array.isArray(response.data)
//           ? response.data
//           : Array.isArray(response.data.data)
//           ? response.data.data
//           : [];

//         setPunchData(data);

//         const grouped = groupByDayAndEmployee(data, activeTab);
//         const activeGroup = activeTab === 'today' ? grouped.Today : activeTab === 'yesterday' ? grouped.Yesterday : grouped[fromDate] || {};
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
//         console.error('Error fetching punch data:', {
//           message: err.message,
//           status: err.response?.status,
//           data: err.response?.data,
//         });
//         let errorMessage = err.response?.data?.message || err.message || 'Error fetching punch data.';
//         if (err.response?.data instanceof Blob) {
//           try {
//             const text = await err.response.data.text();
//             const parsed = JSON.parse(text);
//             errorMessage = parsed.message || errorMessage;
//           } catch (parseErr) {
//             console.warn('Could not parse error response:', parseErr);
//           }
//         }
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPunchData();
//   }, [activeTab, fromDate, toDate]);

//   const groupByDayAndEmployee = (data, tab) => {
//     const grouped = { Today: {}, Yesterday: {} };

//     if (!Array.isArray(data)) return grouped;

//     if (tab === 'select') {
//       data.forEach((record) => {
//         if (!record.punchin_time || !record.employee_id) return;
//         const date = new Date(record.punchin_time).toISOString().split('T')[0];
//         const empId = record.employee_id;

//         if (!grouped[date]) grouped[date] = {};
//         if (!grouped[date][empId]) grouped[date][empId] = [];
//         grouped[date][empId].push(record);
//       });
//     } else {
//       data.forEach((record) => {
//         if (!record.record_day || !record.employee_id) return;
//         const day = record.record_day;
//         const empId = record.employee_id;

//         if (!grouped[day]) grouped[day] = {};
//         if (!grouped[day][empId]) grouped[day][empId] = [];
//         grouped[day][empId].push(record);
//       });
//     }

//     console.log('Grouped by Day and Employee:', grouped);
//     return grouped;
//   };

//   const groupByHourSlots = (activeGroup) => {
//     const slotMap = {};

//     Object.entries(activeGroup).forEach(([empId, punches]) => {
//       const sorted = [...punches].sort((a, b) => new Date(a.punchin_time) - new Date(b.punchin_time));
//       const firstPunch = sorted[0];

//       if (!firstPunch || !firstPunch.punchin_time) {
//         console.warn(`Skipping punches for employee ${empId}: invalid punchin_time`);
//         return;
//       }

//       const punchDate = new Date(firstPunch.punchin_time);
//       if (isNaN(punchDate.getTime())) {
//         console.warn(`Invalid punchin_time for employee ${empId}:`, firstPunch.punchin_time);
//         return;
//       }

//       const hour = punchDate.getHours();
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

//   const handleDownload = async () => {
//     if (!fromDate || !toDate) {
//       setError('Please select both "From" and "To" dates to download punch data.');
//       return;
//     }

//     if (new Date(toDate) < new Date(fromDate)) {
//       setError('"To" date must be on or after "From" date.');
//       return;
//     }

//     if (!validateDateRange(fromDate, toDate)) {
//       setError('Date range must not exceed 5 days.');
//       return;
//     }

//     setError(null);
//     setLoading(true);

//     try {
//       const API_KEY = process.env.REACT_APP_API_KEY;
//       const backendUrl = process.env.REACT_APP_BACKEND_URL;
//       const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
//       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

//       if (!API_KEY) throw new Error('API Key is missing.');
//       if (!backendUrl) throw new Error('Backend URL is missing.');
//       if (!meId) throw new Error('Employee ID is missing.');

//       const url = `${backendUrl}/api/emp-excelsheet?from=${fromDate}&to=${toDate}`;
//       console.log('Downloading Excel from:', url, { headers, employeeId: meId });

//       const response = await axios.get(url, {
//         headers,
//         withCredentials: true,
//         responseType: 'blob',
//       });

//       console.log('Download response:', {
//         status: response.status,
//         headers: response.headers,
//         contentType: response.headers['content-type'],
//       });

//       const contentType = response.headers['content-type'];
//       if (!contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
//         const text = await response.data.text();
//         let errorMessage = 'Unexpected response format';
//         try {
//           const parsed = JSON.parse(text);
//           errorMessage = parsed.message || errorMessage;
//         } catch (parseErr) {
//           console.warn('Could not parse error response:', parseErr, 'Response text:', text);
//         }
//         throw new Error(errorMessage);
//       }

//       const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.setAttribute('download', `punch-data-${fromDate}-to-${toDate}.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(downloadUrl);
//     } catch (err) {
//       console.error('Error downloading punch data:', {
//         message: err.message,
//         status: err.response?.status,
//         headers: err.response?.headers,
//       });

//       let errorMessage = err.message || 'Failed to download punch data.';
//       if (err.response?.data instanceof Blob) {
//         try {
//           const text = await err.response.data.text();
//           console.log('Error response text:', text);
//           const parsed = JSON.parse(text);
//           errorMessage = parsed.message || errorMessage;
//         } catch (parseErr) {
//           console.warn('Could not parse error response:', parseErr);
//         }
//       }

//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle date changes with validation
//   const handleFromDateChange = (e) => {
//     const newFromDate = e.target.value;
//     setFromDate(newFromDate);
//     if (toDate && !validateDateRange(newFromDate, toDate)) {
//       setDateError('Date range must not exceed 5 days.');
//     } else {
//       setDateError(null);
//     }
//   };

//   const handleToDateChange = (e) => {
//     const newToDate = e.target.value;
//     setToDate(newToDate);
//     if (fromDate && !validateDateRange(fromDate, newToDate)) {
//       setDateError('Date range must not exceed 5 days.');
//     } else {
//       setDateError(null);
//     }
//   };

//   const groupedData = groupByDayAndEmployee(punchData, activeTab);
//   const activeGroup = activeTab === 'today' ? groupedData.Today : activeTab === 'yesterday' ? groupedData.Yesterday : groupedData[fromDate] || {};
//   const slotGroupedData = groupByHourSlots(activeGroup);

//   return (
//   <div className="employee-login">
//     <h2 className="heading">Employee Punch Records</h2>

//     <div className="tab-buttons">
//       <button className={activeTab === 'today' ? 'active' : ''} onClick={() => setActiveTab('today')}>
//         Today
//       </button>
//       <button className={activeTab === 'yesterday' ? 'active' : ''} onClick={() => setActiveTab('yesterday')}>
//         Yesterday
//       </button>
//       <button className={activeTab === 'select' ? 'active' : ''} onClick={() => setActiveTab('select')}>
//         Select
//       </button>
//     </div>

//     {activeTab === 'select' && (
//       <div className="date-selection" style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
//         <div>
//           <label htmlFor="fromDate" style={{ marginRight: '8px' }}>From:</label>
//           <input
//             id="fromDate"
//             type="date"
//             value={fromDate}
//             onChange={handleFromDateChange}
//             style={{ padding: '8px', fontSize: '16px' }}
//           />
//         </div>
//         <div>
//           <label htmlFor="toDate" style={{ marginRight: '8px' }}>To:</label>
//           <input
//             id="toDate"
//             type="date"
//             value={toDate}
//             onChange={handleToDateChange}
//             style={{ padding: '8px', fontSize: '16px' }}
//           />
//         </div>
//         <button
//           onClick={handleDownload}
//           disabled={loading || dateError || !fromDate || !toDate}
//           style={{
//             padding: '8px 16px',
//             backgroundColor: loading || dateError || !fromDate || !toDate ? '#ccc' : '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: loading || dateError || !fromDate || !toDate ? 'not-allowed' : 'pointer',
//           }}
//         >
//           {loading ? 'Downloading...' : 'Download Excel'}
//         </button>
//       </div>
//     )}

//     {dateError && <p style={{ color: 'red', fontWeight: 'bold' }}>{dateError}</p>}
//     {loading && <p>Loading...</p>}
//     {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

//     {!loading && !error && activeTab === 'select' && (!fromDate || !toDate) ? (
//       <p>Please select both "From" and "To" dates to view punch data.</p>
//     ) : !loading && !error && Object.keys(slotGroupedData).length > 0 ? (
//       Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
//         <TimeSlotGroup
//           key={slot}
//           time={`${slot} ${activeTab === 'today' ? '(Today)' : activeTab === 'yesterday' ? '(Yesterday)' : `(${fromDate})`}`}
//           slotKey={slot}
//           employeesData={empPunchesArr}
//           isOpen={slotStates[activeTab][slot] || false}
//           setSlotOpen={setSlotOpen}
//         />
//       ))
//     ) : null}
//   </div>
// );
// };

// export default EmployeeLogin;


import React, { useEffect, useState } from 'react';
import './EmployeeLogin.css';
import { Eye } from 'lucide-react';
import axios from 'axios';

const EmployeeCardWithHover = ({ employeePunches }) => {
  const [hovered, setHovered] = useState(false);
  const [avatar, setAvatar] = useState('/default-profile.jpg');

  if (!employeePunches || !Array.isArray(employeePunches) || employeePunches.length === 0) {
    return <div className="employee-card-hover">No punch data available</div>;
  }

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
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

  const isOfficeHQ =
    (latest.punchin_location &&
      typeof latest.punchin_location === 'string' &&
      latest.punchin_location.trim().toLowerCase().includes('office hq')) ||
    (latest.punchout_location &&
      typeof latest.punchout_location === 'string' &&
      latest.punchout_location.trim().toLowerCase().includes('office hq'));
  console.log(`isOfficeHQ for ${name}:`, isOfficeHQ, {
    punchin_location: latest.punchin_location,
    punchout_location: latest.punchout_location,
  });
  const cardClass = isOfficeHQ
    ? 'employee-card-hover bg-office-hq'
    : 'employee-card-hover bg-default';

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
  }, [photoUrl]);

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
        } else {
          console.warn(`Invalid punch pair at index ${index}:`, punch);
        }
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [slotStates, setSlotStates] = useState({ today: {}, yesterday: {}, select: {} });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dateError, setDateError] = useState(null);

  // Function to validate date range
  const validateDateRange = (from, to) => {
    if (!from || !to) return { valid: true }; // No error if either date is not set
    const fromDateObj = new Date(from);
    const toDateObj = new Date(to);

    // Check if toDate is before fromDate
    if (toDateObj < fromDateObj) {
      return { valid: false, error: "'To' date must be on or after 'From' date." };
    }

    // Check if the date range exceeds 5 days
    const diffTime = toDateObj - fromDateObj;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffDays > 5) {
      return { valid: false, error: "Date range must not exceed 5 days." };
    }

    return { valid: true };
  };

  useEffect(() => {
    const fetchPunchData = async () => {
      // Skip fetching for 'select' tab until both dates are set
      if (activeTab === 'select' && (!fromDate || !toDate)) {
        setPunchData([]);
        setLoading(false);
        setError(null);
        return;
      }

      // Validate date range for 'select' tab
      if (activeTab === 'select') {
        const validation = validateDateRange(fromDate, toDate);
        if (!validation.valid) {
          setError(validation.error);
          setPunchData([]);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);
      setDateError(null);

      try {
        const API_KEY = process.env.REACT_APP_API_KEY;
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
        const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

        if (!API_KEY) throw new Error('API Key is missing.');
        if (!backendUrl) throw new Error('Backend URL is missing.');
        if (!meId) throw new Error('Employee ID is missing.');

        let url = `${backendUrl}/api/employeelogin/today-yesterday-punches`;
        if (activeTab === 'select') {
          url = `${backendUrl}/api/employeelogin/punches?from=${fromDate}&to=${toDate}`;
        }

        console.log('Fetching punch data from:', url, { headers });
        const response = await axios.get(url, {
          headers,
          withCredentials: true,
        });

        console.log('Punch data response:', response.data);

        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setPunchData(data);

        const grouped = groupByDayAndEmployee(data, activeTab);
        const activeGroup = activeTab === 'today' ? grouped.Today : activeTab === 'yesterday' ? grouped.Yesterday : grouped[fromDate] || {};
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
        console.error('Error fetching punch data:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        let errorMessage = err.response?.data?.message || err.message || 'Error fetching punch data.';
        if (err.response?.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const parsed = JSON.parse(text);
            errorMessage = parsed.message || errorMessage;
          } catch (parseErr) {
            console.warn('Could not parse error response:', parseErr);
          }
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPunchData();
  }, [activeTab, fromDate, toDate]);

  const groupByDayAndEmployee = (data, tab) => {
    const grouped = { Today: {}, Yesterday: {} };

    if (!Array.isArray(data)) return grouped;

    if (tab === 'select') {
      data.forEach((record) => {
        if (!record.punchin_time || !record.employee_id) return;
        const date = new Date(record.punchin_time).toISOString().split('T')[0];
        const empId = record.employee_id;

        if (!grouped[date]) grouped[date] = {};
        if (!grouped[date][empId]) grouped[date][empId] = [];
        grouped[date][empId].push(record);
      });
    } else {
      data.forEach((record) => {
        if (!record.record_day || !record.employee_id) return;
        const day = record.record_day;
        const empId = record.employee_id;

        if (!grouped[day]) grouped[day] = {};
        if (!grouped[day][empId]) grouped[day][empId] = [];
        grouped[day][empId].push(record);
      });
    }

    console.log('Grouped by Day and Employee:', grouped);
    return grouped;
  };

  const groupByHourSlots = (activeGroup) => {
    const slotMap = {};

    Object.entries(activeGroup).forEach(([empId, punches]) => {
      const sorted = [...punches].sort((a, b) => new Date(a.punchin_time) - new Date(b.punchin_time));
      const firstPunch = sorted[0];

      if (!firstPunch || !firstPunch.punchin_time) {
        console.warn(`Skipping punches for employee ${empId}: invalid punchin_time`);
        return;
      }

      const punchDate = new Date(firstPunch.punchin_time);
      if (isNaN(punchDate.getTime())) {
        console.warn(`Invalid punchin_time for employee ${empId}:`, firstPunch.punchin_time);
        return;
      }

      const hour = punchDate.getHours();
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

  const handleDownload = async () => {
    if (!fromDate || !toDate) {
      setError('Please select both "From" and "To" dates to download punch data.');
isosort
      return;
    }

    const validation = validateDateRange(fromDate, toDate);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const API_KEY = process.env.REACT_APP_API_KEY;
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
      const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

      if (!API_KEY) throw new Error('API Key is missing.');
      if (!backendUrl) throw new Error('Backend URL is missing.');
      if (!meId) throw new Error('Employee ID is missing.');

      const url = `${backendUrl}/api/emp-excelsheet?from=${fromDate}&to=${toDate}`;
      console.log('Downloading Excel from:', url, { headers, employeeId: meId });

      const response = await axios.get(url, {
        headers,
        withCredentials: true,
        responseType: 'blob',
      });

      console.log('Download response:', {
        status: response.status,
        headers: response.headers,
        contentType: response.headers['content-type'],
      });

      const contentType = response.headers['content-type'];
      if (!contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        const text = await response.data.text();
        let errorMessage = 'Unexpected response format';
        try {
          const parsed = JSON.parse(text);
          errorMessage = parsed.message || errorMessage;
        } catch (parseErr) {
          console.warn('Could not parse error response:', parseErr, 'Response text:', text);
        }
        throw new Error(errorMessage);
      }

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `punch-data-${fromDate}-to-${toDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error downloading punch data:', {
        message: err.message,
        status: err.response?.status,
        headers: err.response?.headers,
      });

      let errorMessage = err.message || 'Failed to download punch data.';
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          console.log('Error response text:', text);
          const parsed = JSON.parse(text);
          errorMessage = parsed.message || errorMessage;
        } catch (parseErr) {
          console.warn('Could not parse error response:', parseErr);
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle date changes with validation
  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    if (toDate) {
      const validation = validateDateRange(newFromDate, toDate);
      setDateError(validation.error || null);
    } else {
      setDateError(null);
    }
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    setToDate(newToDate);
    if (fromDate) {
      const validation = validateDateRange(fromDate, newToDate);
      setDateError(validation.error || null);
    } else {
      setDateError(null);
    }
  };

  const groupedData = groupByDayAndEmployee(punchData, activeTab);
  const activeGroup = activeTab === 'today' ? groupedData.Today : activeTab === 'yesterday' ? groupedData.Yesterday : groupedData[fromDate] || {};
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
        <button className={activeTab === 'select' ? 'active' : ''} onClick={() => setActiveTab('select')}>
          Select
        </button>
      </div>

      {activeTab === 'select' && (
        <div className="date-selection" style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div>
            <label htmlFor="fromDate" style={{ marginRight: '8px' }}>From:</label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              style={{ padding: '8px', fontSize: '16px' }}
            />
          </div>
          <div>
            <label htmlFor="toDate" style={{ marginRight: '8px' }}>To:</label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              style={{ padding: '8px', fontSize: '16px' }}
            />
          </div>
          <button
            onClick={handleDownload}
            disabled={loading || dateError || !fromDate || !toDate}
            style={{
              padding: '8px 16px',
              backgroundColor: loading || dateError || !fromDate || !toDate ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || dateError || !fromDate || !toDate ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Downloading...' : 'Download Excel'}
          </button>
        </div>
      )}

      {dateError && <p style={{ color: 'red', fontWeight: 'bold' }}>{dateError}</p>}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {!loading && !error && activeTab === 'select' && (!fromDate || !toDate) ? (
        <p>Please select both "From" and "To" dates to view punch data.</p>
      ) : !loading && !error && Object.keys(slotGroupedData).length > 0 ? (
        Object.entries(slotGroupedData).map(([slot, empPunchesArr]) => (
          <TimeSlotGroup
            key={slot}
            time={`${slot} ${activeTab === 'today' ? '(Today)' : activeTab === 'yesterday' ? '(Yesterday)' : `(${fromDate})`}`}
            slotKey={slot}
            employeesData={empPunchesArr}
            isOpen={slotStates[activeTab][slot] || false}
            setSlotOpen={setSlotOpen}
          />
        ))
      ) : null}
    </div>
  );
};

export default EmployeeLogin;
