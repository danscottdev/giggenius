import React from "react";

function PageHeader({ title }: { title: string }) {
  return (
    <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-0">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    </div>
  );
}

export default PageHeader;
