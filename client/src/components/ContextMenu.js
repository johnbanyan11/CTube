import React, { useEffect, useRef } from "react";

function ContextMenu({ options, coords, menu, setMenu }) {
  const menuRef = useRef(null);

  useEffect(() => {
    // console.log("inside context menu");
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e) => {
    console.log("inside handle outside click");
    if (e.target.id !== "context-opener") {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    }
  };

  const handleClick = (e, callback) => {
    console.log("wwwwwwww", callback);
    e.stopPropagation();
    setMenu(false);
    callback();
  };

  return (
    <div
      style={{
        top: coords.y,
        left: coords.x,
        backgroundColor: "gray",
        position: "fixed",
        padding: "0px 5px",
        zIndex: 100,
      }}
      // className={`bg-blue-400 fixed py-2 z-[100]`}
      ref={menuRef}
    >
      <ul>
        {options.map(({ name, callback }) => (
          <li
            key={name}
            style={{ padding: "10px 5px", cursor: "pointer" }}
            // className="px-5 py-2 cursor-pointer hover:bg-gray-400"
            onClick={(e) => handleClick(e, callback)}
          >
            <span
              style={{ color: "white" }}
              // className="text-white"
            >
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;
