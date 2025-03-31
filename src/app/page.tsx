import React from "react";
import HomeComponent from "./components/home"; 

export default function Page() { 
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <HomeComponent /> 

      </main>

      
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
        <p>
          .. Design by &copy;{" "}
          <a
            href="https://portfolio-isha-pi.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Isha Bhoyar 2025
          </a>{" "}
          ..
        </p>
      </footer>
    </div>
  );
}
