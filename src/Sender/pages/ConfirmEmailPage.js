import React, { useState, useRef, useEffect } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
import "./css/ConfirmEmailPage.css";
import { Hourglass, Mail } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import axios from "axios";
export default function ConfirmEmailPage() {
const [code, setCode] = useState(["", "", "", "", "", ""]);
const [isDisabled, setIsDisabled] = useState(false);
const [timer, setTimer] = useState(0);
const inputsRef = useRef([]);
const navigate = useNavigate();


// return the raw (percent-encoded) value of a query param, or null if missing
function getRawQueryParam(name) {
  const href = window.location.href;
  const qIndex = href.indexOf('?');
  if (qIndex === -1) return null;

  // query string without the leading '?', and ignore hash fragment
  const query = href.slice(qIndex + 1).split('#')[0];
  if (!query) return null;

  const parts = query.split('&');
  for (const p of parts) {
    const eq = p.indexOf('=');
    if (eq === -1) continue;
    const key = p.slice(0, eq);
    if (key === name) {
      // return value exactly as in URL, including %XX sequences
      return p.slice(eq + 1);
    }
  }
  return null;
}

//error message state
const [ShowResendbtn,SetShowResendbtn]=useState(false)

  const [err, setErr] = useState(2);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setErr(2);
    const email = getRawQueryParam("email");
    const token = getRawQueryParam('token');

    const payload = {
      email: email,
      token: token,
    };

    console.log("payload before sending:", payload);
    console.log(token)

    const confirmEmail = async () => {
      const url = `https://stakeexpress.runasp.net/api/Accounts/confirm-email?Email=${email}&Token=${encodeURIComponent(token)}`;
      console.log(url)
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web api"
          }
           
        });

        console.log("status:", res.status);

        const text = await res.text(); 
        try {
          const json = JSON.parse(text);
          console.log("response json:", json);
        } catch (e) {
          console.log("response text:", text);
        }

        if (res.ok) {
          setMessage("confirmed email successfully");
          setErr(0);
            toast.info('Redirecting to Login Page')
          setTimeout(()=>{
            navigate("/")
          },3000)
        } else {
          setMessage("error confirming email");
          setErr(1);
        }
      } catch (err) {
        console.error("network or unexpected error:", err);
        setMessage("error in confirming Email");
        setErr(1);
      }
    };

    if (!payload.email || !payload.token) {
      console.warn("Missing email or token in URL params:", payload);
      setMessage("Missing email or token.");
      setErr(1);
      return;
    }

    confirmEmail();
  }, []);

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
const handleResend = async() => {
    
    // setIsDisabled(true);
    // setTimer(120);
 const email=getRawQueryParam('email')
    try{
        const res=await fetch(`https://stakeexpress.runasp.net/api/Accounts/resend-email-confirmation-link?email=${email}`,{
            headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
          }
        })
        if(res.ok){
         
            console.log('success in resending email')
            setMessage("The email has been resent. Kindly check your inbox and confirm receipt.")
        }

    }catch(err){
        console.log('error in renseding email',err)
          setMessage("error in renseding email")
      }

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

        <form >
        {/* <label className="input-label">Confirmation Code</label> */}

        {/* <div className="otp-container">
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
        </div> */}
        {/* Error message */}
       

            
        {err===0 && (
            
            <p className="text-success">{message}</p>
            
            
        )}
        {err===1 && (
            

        <p className="text-danger fs-5 fw-bolder">{message}</p>
        )}
     
        
        <button
            type="button"
            onClick={handleResend}
            className="resend-btn"
           
            disabled={ShowResendbtn||isDisabled}
            style={{
            opacity: isDisabled ? 0.6 : 1,
            cursor: isDisabled ? "not-allowed" : "pointer",
            }}
        >
            Resend Code
        </button>

        {isDisabled && (
        
            <p className="timer-text">
            You can resend the code after {formatTime(timer)} 
            
            <Hourglass className="hourglass" />
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
