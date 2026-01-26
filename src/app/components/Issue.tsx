import { UserIssue } from '@/interfaces/UserIssue'
import React from 'react'

interface IssueProps {
  userIssue: UserIssue | undefined
}

const Issue: React.FC<IssueProps> = ({ userIssue }) => {
  if (!userIssue) {
    return (
      <section className="w-full flex items-center justify-center p-6">
        <p className="text-gray-500">No issue details available.</p>
      </section>
    )
  }

  return (
    <section className="w-full flex flex-col md:p-8 p-4   items-center justify-start gap-6">
      <h3 className="text-2xl md:text-4xl  font-semibold text-center">User Issue Details</h3>

      {/* Category */}
      <div className="w-full max-w-2xl  rounded-md ">
        <p><strong>Category:</strong> {userIssue.category_details?.category}</p>
        <p><strong>Subcategory:</strong> {userIssue.category_details?.subcategory}</p>
      </div>

      {/* Mode & Location */}
      <div className="w-full max-w-2xl rounded-md  ">
        <p><strong>Mode of Service:</strong> {userIssue.modeOfService}</p>
        <p><strong>Location:</strong> {userIssue.location || "N/A"}</p>
      </div>

      {/* Device Details */}
      <div className="w-full max-w-2xl  rounded-md  ">
        <h4 className="font-semibold mb-2">Device Details</h4>
        <p><strong>Brand:</strong> {userIssue.device_details?.brand}</p>
        <p><strong>Model:</strong> {userIssue.device_details?.model}</p>
        <p><strong>Type:</strong> {userIssue.device_details?.device_type}</p>
        <p><strong>OS Version:</strong> {userIssue.device_details?.os_version}</p>
      </div>

      {/* Purchase Info */}
      <div className="w-full max-w-2xl  rounded-md  ">
        <h4 className="font-semibold mb-2">Purchase Information</h4>
        <p><strong>Purchase Date:</strong> {userIssue.purchase_info?.purchase_date}</p>
        <p><strong>Warranty:</strong> {userIssue.purchase_info?.warranty_status}</p>
        <p><strong>Purchase Location:</strong> {userIssue.purchase_info?.purchase_location}</p>
      </div>

      {/* Problem Description */}
      <div className="w-full max-w-2xl  rounded-md  ">
        <h4 className="font-semibold mb-2">Problem Description</h4>
        <p><strong>Symptoms:</strong> {userIssue.problem_description?.symptoms}</p>
        <p><strong>Error Messages:</strong> {userIssue.problem_description?.error_messages}</p>
        <p><strong>Frequency:</strong> {userIssue.problem_description?.frequency}</p>
        <p><strong>Trigger:</strong> {userIssue.problem_description?.trigger}</p>
        <p><strong>Troubleshooting Attempts:</strong> {userIssue.problem_description?.troubleshooting_attempts}</p>
      </div>

      {/* Summary */}
      <div className="w-full max-w-2xl  rounded-md  ">
        <h4 className="font-semibold mb-2">Summary</h4>
        <p>{userIssue.summary}</p>
      </div>
    </section>
  )
}

export default Issue
