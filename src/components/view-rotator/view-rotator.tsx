import React, { useCallback, useEffect, useState } from "react";
import { sendUE } from "../arcware/ps-functions";
import { TbCapture } from "react-icons/tb";

// Simple module-level event bus to synchronize index across all instances
type Listener = (idx: number) => void;
const listeners: Set<Listener> = new Set();
let sharedIndex = 0;
const notifyAll = (idx: number) => {
  for (const l of listeners) l(idx);
};

type ViewRotatorProps = {
  views?: string[]; // optional override
};

const ViewRotator: React.FC<ViewRotatorProps> = ({
  views = ["0", "1", "2", "3"],
}) => {
  const activeViews = views;
  const [idx, setIdx] = useState(sharedIndex);

  useEffect(() => {
    const listener: Listener = (i) => setIdx(i);
    listeners.add(listener);
    // on mount, sync to sharedIndex
    setIdx(sharedIndex);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const sendView = useCallback(
    (newIdx: number) => {
      const norm =
        ((newIdx % activeViews.length) + activeViews.length) %
        activeViews.length;
      sharedIndex = norm;
      notifyAll(sharedIndex);
      const label = `${activeViews[norm]}`;
      sendUE({ view: label });
    },
    [activeViews]
  );

  const prev = useCallback(() => sendView(idx - 1), [idx, sendView]);
  const next = useCallback(() => sendView(idx + 1), [idx, sendView]);

  return (
    <div>
      <div className="cc-views-bar">
        <button
          type="button"
          className="sp-export-btn"
          onClick={prev}
          onMouseDown={(e) => e.preventDefault()}
          aria-label="Previous view"
        >
          &lt;
        </button>
        <div className="cc-views-label" aria-live="polite">
          {`view-0${activeViews[idx]}`}
        </div>
        <button
          type="button"
          className="sp-export-btn"
          onClick={next}
          onMouseDown={(e) => e.preventDefault()}
          aria-label="Next view"
        >
          &gt;
        </button>
        <button
          type="button"
          className="sp-export-btn"
          aria-label="Screenshot"
          title="Take a screenshot of the current view"
          onClick={() => sendUE({ screenshot: "res-01" })}
          onMouseDown={(e) => e.preventDefault()}
        >
          <TbCapture />
        </button>
      </div>
    </div>
  );
};

export default ViewRotator;
