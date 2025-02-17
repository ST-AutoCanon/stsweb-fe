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
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/holidays`, { headers })
            .then(response => {
                setHolidays(response.data);
                localStorage.setItem("holidays", JSON.stringify(response.data));
            })
            .catch(error => {
                console.error("Error fetching holidays:", error);
                const storedHolidays = localStorage.getItem("holidays");
                if (storedHolidays) {
                    setHolidays(JSON.parse(storedHolidays));
                }
            });
    }, []);

    const getHoliday = (date) => holidays.find(h => new Date(h.date).toDateString() === date.toDateString());

    const tileClassName = ({ date, view }) => {
        if (view !== "month") return "";
        const holiday = getHoliday(date);
        return holiday ? (holiday.type === "Government" ? "govt-holiday" : "company-holiday") : "";
    };

    const tileContent = ({ date, view }) => {
        if (view !== "month") return null;
        const holiday = getHoliday(date);
        return holiday ? (
            <div 
                className="holiday-dot" 
                data-tooltip-id="holiday-tooltip"
                data-tooltip-content={holiday.occasion}
            ></div>
        ) : null;
    };

    const handleChange = (newDate) => {
        if (newDate.getFullYear() === currentYear) {
            setDate(newDate);
        }
    };

    return (
        <div className="calendar-container">
            {/* Close Button */}
            <button className="close-btn" onClick={closeCalendar}>X</button>

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
        </div>
    );
};

export default HolidayCalendar;
