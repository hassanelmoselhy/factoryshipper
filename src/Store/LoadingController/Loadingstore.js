import { create } from "zustand";
const UseLoadingStore=create((set)=>({
    
    
    Loading:false,
    Show:()=>set({Loading:true}),
    Hide:()=> set({Loading:false}),

}))
export default UseLoadingStore;