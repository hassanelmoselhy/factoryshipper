import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/avatar.css";

export default function Avatar({ letter = "A", title = "Avatar A" }) {
  const cls = `avatar-bootstrap  avatar-gradient-blue-cyan `;
  return (
    <span className={cls} role="img" aria-label={title} title={title}>
      {letter}
    </span>
  );
}
