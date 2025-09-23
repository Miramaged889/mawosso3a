import React from "react";

// Utility function to detect URLs and make them clickable
export const makeUrlsClickable = (text: string): React.ReactElement => {
  if (!text) return React.createElement(React.Fragment);

  // URL regex pattern to match http/https URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return React.createElement(
    React.Fragment,
    null,
    parts.map((part: string, index: number) => {
      if (urlRegex.test(part)) {
        return React.createElement(
          "a",
          {
            key: index,
            href: part,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-600 hover:text-blue-800 underline",
          },
          part
        );
      }
      return part;
    })
  );
};
