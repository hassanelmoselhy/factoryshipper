import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ConfirmEmailPage.css";
import { Hourglass, Mail } from "lucide-react";
import Swal from "sweetalert2";

export default function ConfirmEmailPage() {
const [code, setCode] = useState(["", "", "", "", "", ""]);
const [isDisabled, setIsDisabled] = useState(false);
const [timer, setTimer] = useState(0);
const inputsRef = useRef([]);
const navigate = useNavigate();

// handle typing each number
const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < code.length - 1) {
        inputsRef.current[index + 1].focus();
    }
    }
};

// handle backspace
const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
    inputsRef.current[index - 1].focus();
    }
};

// handle submit
const handleSubmit = (e) => {
    e.preventDefault();
    const enteredCode = code.join("");
    if (enteredCode === "123456") {
        Swal.fire({
            position: "center-center",
            icon: "success",
            title: "Email confirmed successfully!",
            showConfirmButton: false,
            timer: 2000
                });
    navigate("/");
    } else {
    alert("Invalid confirmation code. Please try again.");
    }
};

  // handle resend with timer
const handleResend = () => {
    alert("Code resent successfully!");
    setIsDisabled(true);
    setTimer(90);
};

  // countdown logic
useEffect(() => {
    let interval;
    if (isDisabled && timer > 0) {
    interval = setInterval(() => {
        setTimer((prev) => prev - 1);
    }, 1000);
    } else if (timer === 0) {
    setIsDisabled(false);
    clearInterval(interval);
    }
    return () => clearInterval(interval);
}, [isDisabled, timer]);

  // convert seconds to mm:ss format
const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

return (
    <div className="confirm-container">
    <div className="confirm-card">
        <div className="icon-wrapper">
        <Mail className="mail-icon" />
        </div>

        <h2 className="title">Email Confirmation</h2>
        <p className="subtitle">
        We’ve sent a confirmation code to your email address. <br />
        Please enter it below.
        </p>

        <form onSubmit={handleSubmit}>
        <label className="input-label">Confirmation Code</label>

        <div className="otp-container">
            {code.map((digit, index) => (
            <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="otp-input"
            />
            ))}
        </div>

        <button type="submit" className="submit-btn">
            Submit
        </button>

        <button
            type="button"
            onClick={handleResend}
            className="resend-btn"
            disabled={isDisabled}
            style={{
            opacity: isDisabled ? 0.6 : 1,
            cursor: isDisabled ? "not-allowed" : "pointer",
            }}
        >
            Resend Code
        </button>

        {isDisabled && (
            <p className="timer-text">
            You can resend the code after {formatTime(timer)} <Hourglass />
            </p>
        )}
        </form>

        <p className="hint-text">
        Didn’t receive the code? Check your spam folder.
        </p>
    </div>
    </div>
);
}
