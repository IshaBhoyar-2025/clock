"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, StopCircle } from "lucide-react";

export default function HomeComponent() {
  const [mode, setMode] = useState<"clock" | "stopwatch" | "countdown">("clock");
  const [time, setTime] = useState<Date | null>(null);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0);
  const [countdownInput, setCountdownInput] = useState(10);
  const lastTimestamp = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (mode === "clock") {
      setIsRunning(false);
      setStopwatchTime(0);
      setCountdownTime(0);
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "stopwatch") {
      setCountdownTime(0);
    }

    if (mode === "stopwatch" && isRunning && !isPaused) {
      lastTimestamp.current = performance.now() - stopwatchTime * 1000;
      intervalRef.current = setInterval(() => {
        const now = performance.now();
        setStopwatchTime((prev) => {
          if (lastTimestamp.current !== null) {
            const elapsed = (now - lastTimestamp.current) / 1000;
            lastTimestamp.current = now;
            return Math.round((prev + elapsed) * 100) / 100;
          }
          return prev;
        });
      }, 10);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mode, isRunning, isPaused]);

  useEffect(() => {
    if (mode === "countdown") {
      setStopwatchTime(0);
    }
    if (mode === "countdown" && isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 0) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mode, isRunning, isPaused]);

  const handleModeSwitch = (newMode: "clock" | "stopwatch" | "countdown") => {
    if (mode !== newMode) {
      setIsRunning(false);
      setIsPaused(false);
      setStopwatchTime(0);
      setCountdownTime(0);
    }
    setMode(newMode);
  };

  const formatTime = (seconds: number) => {
    if (mode === "countdown") {
      return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
    }
    const hours = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    const ms = Math.floor((seconds % 1) * 100).toString().padStart(2, "0");

    return `${hours}:${mins}:${secs}.${ms}`;
  };

  const hours = time ? (time.getHours() % 12 || 12).toString().padStart(2, "0") : "00";
  const minutes = time ? (time.getMinutes().toString().padStart(2, "0")):"00";
  const seconds = time ? (time.getSeconds().toString().padStart(2, "0")):"00";
  const period = time && time.getHours() < 12 ? "AM" : "PM";


  return (
    <div className="flex flex-col items-center space-y-6 p-4 sm:p-6 w-full max-w-2xl mx-auto overflow-hidden">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        <button
          className={`px-6 py-3 text-lg font-bold rounded-lg border-2 ${mode === "clock" ? "bg-green-500 text-white" : "bg-green-700 text-white"}`}
          onClick={() => handleModeSwitch("clock")}
        >
          Clock
        </button>
        <button
          className={`px-6 py-3 text-lg font-bold rounded-lg border-2 ${mode === "stopwatch" ? "bg-green-500 text-white" : "bg-green-700 text-white"}`}
          onClick={() => handleModeSwitch("stopwatch")}
        >
          Stopwatch
        </button>
        <button
          className={`px-6 py-3 text-lg font-bold rounded-lg border-2 ${mode === "countdown" ? "bg-green-500 text-white" : "bg-green-700 text-white"}`}
          onClick={() => handleModeSwitch("countdown")}
        >
          Countdown
        </button>
      </div>
  
      {mode === "clock" && (
        <div className="relative w-full max-w-[320px] sm:max-w-[360px] h-auto p-4 sm:p-6 bg-black text-green-400 font-mono flex flex-col justify-center items-center rounded-lg border-8 border-gray-600 shadow-xl">
          <div className="flex items-center space-x-3 text-[2.5rem] sm:text-[4rem] font-bold">
            <span>{`${hours}:${minutes}:${seconds}`}</span>
          </div>
          <span className="text-[1.5rem] sm:text-[2rem] bg-green-500 text-black px-2 py-1 rounded-lg">
            {period}
          </span>
        </div>
      )} 
  
      {mode === "stopwatch" && (
        <>
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] h-auto p-4 sm:p-6 bg-black text-green-400 font-mono flex flex-col justify-center items-center rounded-lg border-8 border-gray-600 shadow-xl">
            <div className="text-4xl sm:text-5xl font-bold">{formatTime(stopwatchTime)}</div>
          </div>
  
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
            <button
              className={`px-5 py-3 border ${isRunning ? "border-red-500 text-red-400" : "border-green-500 text-green-400"} rounded-lg flex items-center space-x-2`}
              onClick={() => {
                setIsRunning(!isRunning);
                setIsPaused(false);
                if (!isRunning) setStopwatchTime(0);
              }}
            >
              {isRunning ? <StopCircle size={24} /> : <Play size={24} />}
              <span>{isRunning ? "Stop" : "Start"}</span>
            </button>
  
            <button
              className="px-5 py-3 border border-yellow-500 text-yellow-400 rounded-lg flex items-center space-x-2"
              onClick={() => setIsPaused(!isPaused)}
              disabled={!isRunning}
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>
          </div>
        </>
      )}
  
      {mode === "countdown" && (
        <>
          <div className="flex flex-col items-center space-y-4">
            {!isRunning && (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  className="border p-2 w-20 text-center"
                  value={countdownInput}
                  min="1"
                  onChange={(e) => setCountdownInput(Number(e.target.value))}
                />
                <span className="text-lg">minutes</span>
              </div>
            )}
  
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {isRunning && (
                <button
                  className="px-4 py-2 rounded text-white bg-red-500"
                  onClick={() => {
                    setIsRunning(false);
                    setIsPaused(false);
                    setCountdownTime(0);
                  }}
                >
                  Stop Countdown
                </button>
              )}
  
              {isRunning && (
                <button
                  className={`px-4 py-2 rounded text-white ${isPaused ? "bg-green-500" : "bg-yellow-500"}`}
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? "Unpause" : "Pause"}
                </button>
              )}
            </div>
  
            {!isRunning && (
              <button
                className="px-4 py-2 rounded text-white bg-blue-500"
                onClick={() => {
                  setCountdownTime(countdownInput * 60);
                  setIsRunning(true);
                  setIsPaused(false);
                }}
              >
                Start Countdown
              </button>
            )}
  
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] h-auto p-4 sm:p-6 bg-black text-green-400 font-mono flex flex-col justify-center items-center rounded-lg border-8 border-gray-600 shadow-xl">
              <div className="text-4xl sm:text-5xl font-bold">{formatTime(countdownTime)}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
  
  
}