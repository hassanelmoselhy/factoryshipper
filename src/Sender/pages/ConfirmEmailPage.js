import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ConfirmEmailPage.css";
import { Hourglass, Mail } from "lucide-react";
import { toast } from "sonner";
import { confirmEmail, ResendEmail } from "../Data/AuthenticationService";
import { getRawQueryParam } from "../../utils/Helpers";
export default function ConfirmEmailPage() {
const [isDisabled, setIsDisabled] = useState(false);
const [timer, setTimer] = useState(0);

const navigate = useNavigate();




//error message state
const [ShowResendbtn,SetShowResendbtn]=useState(false)

  const [err, setErr] = useState(2);
  const [message, setMessage] = useState("");

   const confirm =async (email,token)=>{
    
        const response=confirmEmail(email,token)
        const result=await response
        
   

        if (result.Success) {
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
      }


  useEffect(() => {
    setErr(2);
    const email = getRawQueryParam("email");
    const token = getRawQueryParam('token');

    const payload = {
      email: email,
      token: token,
    };



     if (!payload.email || !payload.token) {
      console.warn("Missing email or token in URL params:", payload);
      setMessage("Missing email or token.");
      setErr(1);
      return;
    }
     
      confirm(email,token)

   
  }, []);

  // handle resend with timer
const handleResend = async() => {

 const email=getRawQueryParam('email')
   
       const response=await ResendEmail(email)
        if(response.Success){
            setMessage("The email has been resent. Kindly check your inbox and confirm receipt.")
        }else{
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
