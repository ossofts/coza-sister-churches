import { memo, useEffect, useState } from "react";
import moment, { Moment } from "moment";

const Timer = memo(() => {
  const [time, setTime] = useState<Moment>(moment());

  const timer = () =>
    setInterval(() => {
      setTime(moment());
    }, 1000);

  useEffect(() => {
    timer();
  }, []);

  return (
    <div className="mb-6 flex flex-col items-center">
      <p className="text-gray-600 dark:text-gray-50 text-3xl">{time.format("LT")}</p>
      <p className="text-gray-400 dark:text-gray-50 font-light text-sm">{time.format("dddd ll")}</p>
    </div>
  );
});

export default Timer;
