import PropTypes from "prop-types";

// 如果該頁面 / section 沒有資料，可以使用此component
// 上面是一個material icon，下面是文字
export default function SectionFallback({ materialIconName, fallbackText, fontColor = "text-gray-03" }) {
  return (
    <p className={`d-flex justify-content-center align-items-center flex-column text-center ${fontColor}`}>
      <span className="material-symbols-outlined mb-2">{materialIconName}</span>
      <span>- {fallbackText} -</span>
    </p>
  );
}

// Define PropTypes
SectionFallback.propTypes = {
  materialIconName: PropTypes.string.isRequired,
  fallbackText: PropTypes.node.isRequired,
  fontColor: PropTypes.string,
};
