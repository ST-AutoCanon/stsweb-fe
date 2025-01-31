// import React from "react";
// import "./Sidebar.css";

// const Sidebar = ({ setActiveContent }) => {
//   const menuItems = [
//     "Dashboard",
//     "Profile",
//     "Settings",
//     "Reports",
//     "Analytics",
//     "Notifications",
//     "Support",
//     "Logout",
//     "Extra Item 1",
//     "Extra Item 2",
//     "Extra Item 3",
//     "Extra Item 4",
//     "Extra Item 5",
//     "Notifications",
//     "Support",
//     "Logout",
//     "Extra Item 1",
//     "Extra Item 2",
//     "Extra Item 3",
//     "Extra Item 4",
//     "Extra Item 5",
//   ];

//   return (
//     <div className="sidebar">
//       <ul>
//         {menuItems.map((item, index) => (
//           <li key={index} onClick={() => setActiveContent(item)}>
//             {item}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

import React from "react";
import "./Sidebar.css";
import {
  MdOutlineDashboard,
  MdOutlinePersonOutline,
  MdOutlineAssignmentInd,
  MdOutlineEvent,
  MdOutlineFactCheck,
  MdOutlineCommentBank,
  MdOutlineEmojiEvents,
  MdOutlineContactPhone,
  MdOutlineAssignment,
  MdOutlineDescription,
  MdOutlineSportsHandball,
} from "react-icons/md";

const Sidebar = ({ setActiveContent }) => {
  const menuItems = [
    { name: "Dashboard", icon: <MdOutlineDashboard /> },
    { name: "Profile", icon: <MdOutlinePersonOutline /> },
    { name: "Settings", icon: <MdOutlineAssignmentInd /> },
    { name: "Reports", icon: <MdOutlineEvent /> },
    { name: "Analytics", icon: <MdOutlineFactCheck /> },
    { name: "Notifications", icon: <MdOutlineCommentBank /> },
    { name: "Support", icon: <MdOutlineEmojiEvents /> },
    { name: "Logout", icon: <MdOutlineContactPhone /> },
    { name: "Extra Item 1", icon: <MdOutlineAssignment /> },
    { name: "Extra Item 2", icon: <MdOutlineDescription /> },
    { name: "Extra Item 3", icon: <MdOutlineSportsHandball /> },
    { name: "Extra Item 4", icon: <MdOutlineEvent /> },
    { name: "Extra Item 5", icon: <MdOutlineFactCheck /> },
    { name: "Logout", icon: <MdOutlineContactPhone /> },
    { name: "Extra Item 1", icon: <MdOutlineAssignment /> },
    { name: "Extra Item 2", icon: <MdOutlineDescription /> },
    { name: "Extra Item 3", icon: <MdOutlineSportsHandball /> },
    { name: "Extra Item 4", icon: <MdOutlineEvent /> },
    { name: "Extra Item 5", icon: <MdOutlineFactCheck /> },
  ];

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} onClick={() => setActiveContent(item.name)}>
            <span className="icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
