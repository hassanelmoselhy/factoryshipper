import { create } from "zustand";
const useUserStore=create((set)=>({
    
    
    user:null,

    SetUser:(user)=> set({user}),

    clearUser:()=>set({user:null})
}))
export default useUserStore;