"use client";

import { useEffect, useState } from "react";

function now() {
  return new Date().toISOString().slice(11, 19);
}

/** A live UTC clock for the footer stamp. Blank until hydrated (static HTML). */
export function UtcClock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the time only exists in the browser
    setTime(now());
    const id = window.setInterval(() => setTime(now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular-nums">UTC {time}</span>;
}
