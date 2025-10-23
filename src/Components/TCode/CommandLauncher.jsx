import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CommandLauncher.css";
import useAuthStore from "../../Zustand/Store/useAuthStore";

const CommandLauncher = () => {
  const { access } = useAuthStore();
  const navigate = useNavigate();

  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const terminalRef = useRef(null);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history]);

  const COMMANDS = {
    USRS: {
      description: "List all users",
      rolesAllowed: ["Admin"],
      action: () => [
        "Total Users: 4",
        "- User1 (HR)",
        "- User2 (Accounts)",
        "- User3 (Manager)",
        "- User4 (Support)",
      ],
    },
    TSKS: {
      description: "List all tasks",
      rolesAllowed: ["User"],
      action: () => [
        "Tasks Assigned:",
        "1. Daily Report",
        "2. Attendance Correction",
        "3. Leave Approval",
      ],
    },
    CLS: {
      description: "Clear the screen",
      rolesAllowed: ["Admin", "User"],
      action: () => "CLEAR_SCREEN",
    },
    HELP: {
      description: "List all commands",
      rolesAllowed: ["Admin", "User"],
      action: () => [
        "Available Commands:",
        "USRS - List all Users (Admin only)",
        "TSKS - Show User tasks (User only)",
        "DB T-usr - Mock DB output (All roles)",
        "CLS - Clear screen",
        "HELP - Show commands",
      ],
    },
    "DB T-USR": {
      description: "Mock DB User fetch",
      rolesAllowed: ["Admin", "User"],
      action: () => [
        "Fetching Users from DB...",
        "-> ID: 101 | Name: Alex | Role: HR",
        "-> ID: 102 | Name: Sam | Role: Admin",
        "-> ID: 103 | Name: John | Role: Intern",
      ],
    },
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const input = command.trim();
      const commandKey = input.toUpperCase();

      const cmd = COMMANDS[commandKey];

      if (!cmd) {
        setHistory((prev) => [
          ...prev,
          { prompt: true, command: input },
          { prompt: false, command: `'${input}' is not recognized as a valid code.` },
        ]);
      } else if (!cmd.rolesAllowed.includes(access)) {
        setHistory((prev) => [
          ...prev,
          { prompt: true, command: input },
          { prompt: false, command: "You are not authorized to use this command." },
        ]);
      } else {
        const output = cmd.action();
        if (output === "CLEAR_SCREEN") {
          setHistory([]);
        } else {
          setHistory((prev) => [
            ...prev,
            { prompt: true, command: input },
            ...output.map((line) => ({ prompt: false, command: line })),
          ]);
        }
      }

      setCommand("");
    }
  };

  return (
    <div className="terminal-wrapper">
      <div className="terminal">
        {history.map((entry, index) => (
          <div key={index} className="terminal-line">
            {entry.prompt ? (
              <span className="prompt">HR_ERP:&gt; {entry.command}</span>
            ) : (
              <span>{entry.command}</span>
            )}
          </div>
        ))}
        <div className="terminal-line">
          <span className="prompt">HR_ERP:&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            spellCheck={false}
          />
        </div>
        <div ref={terminalRef}></div>
      </div>
    </div>
  );
};

export default CommandLauncher;
