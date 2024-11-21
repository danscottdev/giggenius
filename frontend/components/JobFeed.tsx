import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";

interface JobFeedProps {
  jobs: Object[];
}

function JobFeed({ jobs }: JobFeedProps) {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (rowId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Match</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <React.Fragment key={job.id}>
              <TableRow
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => toggleRow(job.id)}
              >
                <TableCell>
                  {expandedRows.has(job.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.summary}</TableCell>
                <TableCell>{job.match}</TableCell>
                <TableCell>{job.date}</TableCell>
                <TableCell>{job.seen}</TableCell>
              </TableRow>
              {expandedRows.has(job.id) && (
                <TableRow>
                  <TableCell colSpan={4} className="bg-gray-50">
                    <div className="p-4">
                      {/* Expanded content goes here */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Full Description:</span>{" "}
                          {job.description}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Budget:</span>{" "}
                          {job.budget}
                        </p>
                        {/* Add any additional expanded content here */}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default JobFeed;
