import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ConfirmChangedEmail.css"; // Ensure you use your CSS file
import { Hourglass, Mail } from "lucide-react";
import { toast } from "sonner";
import { getRawQueryParam } from "../../utils/Helpers";
import useUserStore from "../../Store/UserStore/userStore";
export default function ConfirmChangedEmail() {
const [isDisabled, setIsDisabled] = useState(false);
const [timer, setTimer] = useState(0);
const user=useUserStore((state)=>state.user);
const navigate = useNavigate();

  // error message state
  const [ShowResendbtn, SetShowResendbtn] = useState(false);
  const [err, setErr] = useState(2);
  const [message, setMessage] = useState("Verifying your request...");

  // Ref to prevent double-firing in StrictMode
  const processedRef = useRef(false);

  // ================== API LOGIC ==================
  const confirm = async (oldEmail, newEmail, token) => {
    try {
      const baseUrl = "https://stakeexpress.runasp.net/api/Shippers/change-email?";
      const newEmail=(getRawQueryParam("newEmail"));
      const oldEmail=(getRawQueryParam("oldEmail"));
      const token=encodeURIComponent(getRawQueryParam("token"));
      const params = {
        OldEmail:oldEmail,
        NewEmail:newEmail,
        Token:token,
      };

      console.log("params",params)
      const response = await fetch(`${baseUrl}OldEmail=${oldEmail}&NewEmail=${newEmail}&Token=${token}`, {
        method: "POST",
        headers: {
          "X-Client-Key": "web api",
          "Content-Type": "application/json",
         
        },
      });

      if (response.ok) {
        setMessage("Email changed successfully. Redirecting to login...");
        setErr(0); // Success state
        toast.success("Email verified!");     
      } else {
        const errorText = await response.text();
        setMessage(errorText || "Error confirming email change.");
        setErr(1); // Error state
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error occurred.");
      setErr(1);
    }
  };

  // ================== ON MOUNT ==================
  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;
    
    setErr(2); // Set to loading

    // Use URLSearchParams to get the specific params for Change Email
    const searchParams = new URLSearchParams(window.location.search);
    const oldEmail = searchParams.get("OldEmail") || searchParams.get("oldEmail");
    const newEmail = searchParams.get("NewEmail") || searchParams.get("newEmail");
    let token = searchParams.get("Token") || searchParams.get("token");

    // Fix common ASP.NET issue where '+' in tokens becomes ' ' (space)
    if (token && token.includes(" ")) {
        token = token.replace(/ /g, "+");
    }

    const payload = {
      oldEmail: oldEmail,
      newEmail: newEmail,
      token: token,
    };

    if (!payload.oldEmail || !payload.newEmail || !payload.token) {
      console.warn("Missing parameters in URL:", payload);
      setMessage("Invalid link. Missing required information.");
      setErr(1);
      return;
    }

    confirm(payload.oldEmail, payload.newEmail, payload.token);
  }, []);

  // ================== RESEND LOGIC ==================
  const handleResend = async () => {
    // NOTE: Usually, you cannot resend a "Change Email Request" from a public page 
    // because it requires the user's Bearer Token to authorize the change.
    // We disable the button logic slightly to redirect them or show a message.
    
    SetShowResendbtn(true); // Show loading/disabled style
    
    // Simulate a delay or check
    setTimeout(() => {
        setMessage("To resend the verification link, please log in with your old email and request the change again from your profile.");
        setErr(1); 
        SetShowResendbtn(false);
        // Start timer anyway to prevent spamming
        setTimer(60); 
        setIsDisabled(true);
    }, 1000);
  };

  // ================== TIMER LOGIC ==================
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

        <h2 className="title">Email Change Confirmation</h2>
        <p className="subtitle">
          We’re verifying your request to change your email address.
        </p>

        <form>
          {/* Success Message */}
          {err === 0 && <p className="text-success">{message}</p>}

          {/* Error Message */}
          {err === 1 && <p className="text-danger fs-5 fw-bolder">{message}</p>}

          {/* Loading Message */}
          {err === 2 && <p className="text-primary fs-5">Processing...</p>}

          {/* Resend Button (Modified logic as auth is required for this) */}
          <button
            type="button"
            onClick={handleResend}
            className="resend-btn"
            disabled={ShowResendbtn || isDisabled}
            style={{
              opacity: isDisabled ? 0.6 : 1,
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
          >
            Resend Link
          </button>

          {isDisabled && (
            <p className="timer-text">
              You can try again after {formatTime(timer)}
              <Hourglass className="hourglass" />
            </p>
          )}
        </form>

        <p className="hint-text">
            If the link has expired, please log in and update your profile again.
        </p>
      </div>
    </div>
  );
}

