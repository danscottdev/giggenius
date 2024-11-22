"use client";

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
import { Job } from "@/server/db/schema";
import { Button } from "./ui/button";

interface JobFeedProps {
  jobs: Job[];
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

  // TODO: Fetch Match data for each job ID

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
                <TableCell>{job.upwk_title}</TableCell>
                <TableCell>{job.upwk_description}</TableCell>
                <TableCell>MATCH</TableCell>
                <TableCell>{job.createdAt.toLocaleString()}</TableCell>
                <TableCell>{job.is_seen_by_user}</TableCell>
              </TableRow>
              {expandedRows.has(job.id) && (
                <TableRow>
                  <TableCell colSpan={6} className="bg-gray-50">
                    <div className="p-0 flex flex-row justify-between align-center">
                      <div className="w-full border p-4">
                        <h3 className="font-bold">{job.upwk_title}</h3>
                        <p>{job.upwk_description}</p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Budget:</span>{" "}
                          {job.upwk_budget}
                        </p>
                        <div className="mt-4">
                          <h4 className="font-bold">Client Info</h4>
                          <p>Client Info Here</p>
                          <p>Client Info Here</p>
                          <p>Client Info Here</p>
                        </div>
                      </div>
                      <div className="w-96 border p-4">
                        <p className="font-bold text-center mb-2">
                          Match Strength: Strong Match
                        </p>
                        <p className="border border-gray-200 h-32 bg-gray-100 p-3">
                          Match Analysis Ipsum
                        </p>
                        <Button className="w-full mt-2">
                          Rate Match Analysis
                        </Button>
                        <Button className="w-full mt-2">
                          Generate Proposal
                        </Button>
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
