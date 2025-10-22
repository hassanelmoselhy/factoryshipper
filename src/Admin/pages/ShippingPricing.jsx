import React, { useState } from 'react'
import {Plus ,Download,Calculator,Search}from 'lucide-react'
import DropDownList from '../../Components/DropDownList'
import PricingRulesTable from '../components/PricingRulesTable'
import ShppingPriceCalculator from '../components/ShppingPriceCalculator'
export default function ShippingPricing() {
  const [isShippingPricecalcOpen,SetisShippingPricecalcOpen]=useState(false)
  const egypt_governorates = [
    "All" ,
    "Cairo", 
     "Alexandria", 
    "Port Said",
     "Suez",
   "Luxor", 
     "Dakahlia", 
    "Sharqia",
     "Qalyubia",
   "Damietta",
     "Beheira",
     "Gharbia",
     "Monufia",
     "Kafr El Sehg",
     "Giza",
     "Faiyum",
     "Beni Suef",
     "Minya", 
     "Asyut", 
     "Sohag", 
     "Qena",
     "Red Sea",
     "New Valley",
     "Matrouh",
     "North Sina" ,
     "South Sina" 
  ];
  return (

    <>
    <ShppingPriceCalculator show={isShippingPricecalcOpen} onClose={()=>{SetisShippingPricecalcOpen(false)}}/>
    <div className='p-5 w-100 d-flex flex-column gap-4'>
      {/** Header */}
      <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex align-items-center gap-2'>
          <button className='btn btn-primary fw-bolder d-flex align-items-center gap-2 rounded-3'>
            إضافة قاعدة تسعير
              <Plus size={16}/>
              </button>
          <button className='btn btn-outline-light text-black border fw-bolder d-flex align-items-center gap-2 rounded-3'>
            تصدير
            <Download size={16}/>
          </button>
          <button className='btn btn-outline-light text-black border fw-bolder d-flex align-items-center gap-2 rounded-3'
          onClick={()=>{SetisShippingPricecalcOpen(true)}}
          >
            حاسبة التسعير
        <Calculator size={16}/>
        </button>
        
        </div>
        <div className='text-end'>
          <h1 className='fs-4 fw-bolder'>إدارة التسعير والتعريفات</h1>
          <p className='text-muted'>إدارة قواعد التسعير حسب المدينة والوزن</p>
        </div>

      </div>

{/** search and filter */}
      <div className='card border w-100 px-5'>
      
      <div className='d-flex align-items-center gap-4 '>
        
        <div>
          <DropDownList placeholder='جميع المحافظات' options={egypt_governorates}/>
        </div>
        <div className="flex-fill position-relative rounded-4" style={{backgroundColor:'#ddd'}}>
            <Search
              size={20}
              className="position-absolute top-50 translate-middle-y  text-muted"
              style={{ right: "0.75rem" }} // right-3 ≈ 0.75rem
              aria-hidden="true"
            />
            <input
              type="text"
              className="form-control text-end "
              placeholder="البحث في قواعد التسعير..."
            style={{backgroundColor:'#ddd'}}
            />
          </div>
      </div>

      </div>
        <PricingRulesTable />

    </div>
    </>
  )
}

 