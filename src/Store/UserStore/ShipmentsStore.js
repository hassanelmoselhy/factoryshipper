import { create } from "zustand";
const useShipmentsStore=create((set)=>({
    
    
    shipments:null,

    SetShipments:(shipments)=> set({shipments}),

    clearUser:()=>set({user:null})
}))
export default useShipmentsStore;