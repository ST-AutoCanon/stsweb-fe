import React from "react";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { parseLocalDate } from "./leaveUtils";
/**
 * Renders both desktop and mobile views for "My Leave Requests"
 *
 * Props:
 * - selfRequests (array)
 * - handleEdit, handleCancel
 */
const MyRequestsView = ({ selfRequests = [], handleEdit, handleCancel }) => {
  return (
    <>
      <h4 className="my-leaves">My Leave Requests</h4>

      <div className="leave-request-table desktop-view">
        <table className="leave-requests">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Half/Full Day</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Comments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {(selfRequests || [])
              .sort((a, b) =>
                String(b.start_date).localeCompare(String(a.start_date))
              )
              .map((request) => (
                <tr key={request.id || request.leave_id}>
                  <td>{request.leave_type}</td>
                  <td>{parseLocalDate(request.start_date)}</td>
                  <td>{parseLocalDate(request.end_date)}</td>
                  <td>{request.H_F_day}</td>
                  <td className="comment-col">
                    <div className="comment-preview">{request.reason}</div>
                  </td>
                  <td>
                    <span
                      className={`leave-status-label ${
                        request.status === "Approved"
                          ? "leave-approved"
                          : request.status === "Rejected"
                          ? "leave-rejected"
                          : ""
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="comment-col">
                    <div className="comment-preview">{request.comments}</div>
                  </td>
                  <td>
                    <MdOutlineEdit
                      onClick={() => {
                        if (
                          request.status !== "Approved" &&
                          request.status !== "Rejected"
                        )
                          handleEdit(request);
                      }}
                      className={`action-button ${
                        request.status === "Approved" ||
                        request.status === "Rejected"
                          ? "disabled"
                          : ""
                      }`}
                    />
                    <MdDeleteOutline
                      onClick={() => {
                        if (
                          request.status !== "Approved" &&
                          request.status !== "Rejected"
                        )
                          handleCancel(request.id || request.leave_id);
                      }}
                      className={`action-button ${
                        request.status === "Approved" ||
                        request.status === "Rejected"
                          ? "disabled"
                          : ""
                      }`}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* mobile view */}
      <div className="mobile-view">
        {(selfRequests || [])
          .sort((a, b) =>
            String(b.start_date).localeCompare(String(a.start_date))
          )
          .map((request) => (
            <div key={request.id || request.leave_id} className="leave-card">
              <div className="leave-header">
                <span className="leave-type">{request.leave_type}</span>
                <span
                  className={`leave-status-label ${
                    request.status === "Approved"
                      ? "leave-approved"
                      : request.status === "Rejected"
                      ? "leave-rejected"
                      : ""
                  }`}
                >
                  {request.status}
                </span>
              </div>
              <div className="leave-details">
                <p>
                  <strong>Start:</strong> {parseLocalDate(request.start_date)}
                </p>
                <p>
                  <strong>End:</strong> {parseLocalDate(request.end_date)}
                </p>
                <p>
                  <strong>Day Type:</strong> {request.H_F_day}
                </p>
                <p>
                  <strong>Reason:</strong> {request.reason}
                </p>
                <p>
                  <strong>Comments:</strong> {request.comments}
                </p>
              </div>
              <div className="leave-actions">
                <MdOutlineEdit
                  onClick={() => {
                    if (
                      request.status !== "Approved" &&
                      request.status !== "Rejected"
                    )
                      handleEdit(request);
                  }}
                  className={`action-button ${
                    request.status === "Approved" ||
                    request.status === "Rejected"
                      ? "disabled"
                      : ""
                  }`}
                />
                <MdDeleteOutline
                  onClick={() => {
                    if (
                      request.status !== "Approved" &&
                      request.status !== "Rejected"
                    )
                      handleCancel(request.id || request.leave_id);
                  }}
                  className={`action-button ${
                    request.status === "Approved" ||
                    request.status === "Rejected"
                      ? "disabled"
                      : ""
                  }`}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default MyRequestsView;
