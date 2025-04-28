import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./HolidayCalendar.css";
import axios from "axios";
import { Tooltip } from "react-tooltip";

const HolidayCalendar = ({ closeCalendar }) => {
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState(new Date());
  const currentYear = new Date().getFullYear();

  const API_KEY = process.env.REACT_APP_API_KEY;

  const headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/holidays`, { headers })
      .then((response) => {
        setHolidays(response.data);
        localStorage.setItem("holidays", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching holidays:", error);
        const storedHolidays = localStorage.getItem("holidays");
        if (storedHolidays) {
          setHolidays(JSON.parse(storedHolidays));
        }
      });
  }, []);

  const getHoliday = (date) =>
    holidays.find(
      (h) => new Date(h.date).toDateString() === date.toDateString()
    );

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    const holiday = getHoliday(date);
    if (holiday) {
      return holiday.type === "Optional"
        ? "optional-holiday"
        : "company-holiday";
    }
    return "";
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const isSunday = date.getDay() === 0;
    const holiday = getHoliday(date);
    const hasTooltip = isSunday || holiday;

    if (!hasTooltip) return null;
    let tooltipContent = isSunday ? "Sunday" : "";
    if (holiday) {
      tooltipContent = holiday.occasion;
    }

    return (
      <div
        className="tile-tooltip-overlay"
        data-tooltip-id="holiday-tooltip"
        data-tooltip-content={tooltipContent}
        onClick={() => handleChange(date)}
      >
        {isSunday && !holiday && <div className="sunday-dot" />}
        {holiday && holiday.type === "Optional" && (
          <div className="holiday-dot optional-dot" />
        )}
        {holiday && holiday.type === "Company" && (
          <div className="holiday-dot company-dot" />
        )}
      </div>
    );
  };
  const handleChange = (newDate) => {
    if (newDate.getFullYear() === currentYear) {
      setDate(newDate);
    }
  };

  return (
    <div className="calendar-container">
      <button className="close-btn" onClick={closeCalendar}>
        X
      </button>

      <div className="calendar-wrapper">
        <Calendar
          onChange={handleChange}
          value={date}
          minDate={new Date(currentYear, 0, 1)}
          maxDate={new Date(currentYear, 11, 31)}
          maxDetail="month"
          tileDisabled={({ date }) => date.getFullYear() !== currentYear}
          tileClassName={tileClassName}
          tileContent={tileContent}
          prev2Label={null}
          next2Label={null}
        />
        <Tooltip id="holiday-tooltip" place="top" effect="solid" />
        <div className="holiday-legend-top">
          <div className="legend-item">
            <div className="color-box optional"></div>
            <span>Optional</span>
          </div>
          <div className="legend-item">
            <div className="color-box company"></div>
            <span>Company</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendar;
