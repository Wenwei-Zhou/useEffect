import { useEffect } from "react";
import ProgressBar from "./ProgressBar.jsx";

const totalTime = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {

  
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, totalTime
  );

    return () => {
      clearTimeout(timer);
    }
  }, [onConfirm]); // 添加未确认的prop作为依赖项, 不是执行它, 而只是指向它, 将其用作值
  // 当Modal打开时，就会执行DeleteConfirmation component，每次执行时useEffect里面都会执行一次
  // 当打开Modal后执行DeleteConfirmation component，就算不点yes button，在3秒后就会执行onConfirm()
  // 加了clean up function后，每当关闭Modal，也就是停止执行DeleteConfirmation component。使用clearTimeout(timer)，意思是终止计时，timer这个计时器就会归零，就是3秒后也不会执行onConfirm()。要等到下次执行DeleteConfirmation component时才会重新计时

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar totalTime={totalTime} />
    </div>
  );
}
