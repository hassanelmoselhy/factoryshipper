import { create } from "zustand";
const useUserStore=create((set,get)=>({
    
    
    user:null,

    SetUser:(user)=> set({user}),

    clearUser:()=>set({user:null}),
    GetUser:()=> get().user
}))
export default useUserStore;