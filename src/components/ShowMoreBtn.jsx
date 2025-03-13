import { useState } from "react";

import PropTypes from "prop-types";

export default function ShowMoreBtn({ text, initialShow = false, maxCharacter = 250 }) {
  const [isShow, setIsShow] = useState(initialShow);

  const handleClick = () => {
    setIsShow((prevIsShow) => !prevIsShow);
  };

  const displayedText = isShow ? text : text.length > maxCharacter ? text.slice(0, maxCharacter) + "..." : text;

  return (
    <>
      {displayedText
        .replace(/\\n/g, "\n")
        .split("\n")
        .map((line, index) => (
          <p key={index} className="tab-details">
            {line}
            <br></br>
          </p>
        ))}
      {text.length > maxCharacter && (
        <div className="d-flex align-items-center py-3" role="button" onClick={handleClick}>
          <p className="text-primary">{isShow ? "更少" : "更多"}</p>
          <span className="material-symbols-outlined text-primary align-middle">{isShow ? "keyboard_arrow_up" : "expand_more"}</span>
        </div>
      )}
    </>
  );
}
ShowMoreBtn.propTypes = {
  text: PropTypes.string,
  initialShow: PropTypes.bool,
  maxCharacter: PropTypes.number,
};
