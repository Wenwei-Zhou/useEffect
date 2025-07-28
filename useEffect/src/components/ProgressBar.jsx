import { useEffect, useState } from "react";
export default function ProgressBar({totalTime}) {
    const [remainingTime, setRemaininingTime] = useState(totalTime);
    
      useEffect(() => {
        const interval = setInterval(() => {
            setRemaininingTime(prevTime => prevTime - 10);
          }, 10);
    
          return () => {
            clearInterval(interval);
          }
      }, []);
      // 时间间隔，进度条总时长是3秒
      // setRemaininingTime(prevTime => prevTime - 10); prevTime是当前的value，意思是3000 - 10，一支减，减到0位置（就是没有时间）
      // 需要cleanup函数来避免在幕后（Console）进行的进程

    return(
        <>
        <progress value={remainingTime} max={totalTime} />
      {/* 进度条，进度条一直进度，remainingTime=0时，进度条就消失 */}
      </>
    )
}