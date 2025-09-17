import { create } from "zustand";
const useUserStore=create((set)=>({
    
    
    user:sessionStorage.getItem("user")?JSON.parse(sessionStorage.getItem("user")):null,

    SetUser:(user)=> set({user}),

    clearUser:()=>set({user:null})
}))
export default useUserStore;