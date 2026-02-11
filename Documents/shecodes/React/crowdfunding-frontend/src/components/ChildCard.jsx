import React, { useState } from "react";

function ChildCard({ child }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`child-card ${expanded ? "expanded" : ""}`}
      aria-expanded={expanded}
    >
      <header className="child-card-header">
        <h4>
          {child.firstname} {child.lastname}
        </h4>
        <button
          aria-controls={`child-${child.id}-content`}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="child-toggle"
        >
          {expanded ? "Hide" : "Details"}
        </button>
      </header>

      <div id={`child-${child.id}-content`} className="child-card-body">
        <p className="muted">DOB: {child.DOB}</p>
        <p>{child.description}</p>
      </div>
    </article>
  );
}

export default ChildCard;
