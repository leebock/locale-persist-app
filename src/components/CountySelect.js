import './CountySelect.css';
import { useState } from 'react';

export const CountySelect = ({counties, onSelect:reportSelection, showCloseButton, onCancel:handleCancel}) => {

    const [candidates, setCandidates] = useState([]);

    const handleSearchChange = (event) => {
        const searchString = event.target.value.trim().toLowerCase();
        if (searchString === "") {
            setCandidates([]);
        } else {
            setCandidates(
                counties.filter(
                    (value)=>value.NAME.toLowerCase().includes(searchString)
                )
            );
        }
    }


    return (
    <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center" 
        style={{backgroundColor: "rgba(0,0,0,0.6)"}}>
        
        <div className='position-fixed bg-white p-2 rounded d-flex flex-column' style={{top: "25%", width: "500px", maxHeight: "70%"}}>
            <div id="inner" className='d-flex flex-column overflow-hidden position-relative'>
                <div className='d-flex justify-content-between'>
                    <h4 className='mt-1 ms-1 mb-2'>Choose your county</h4>
                    {
                    showCloseButton && 
                    <button className='btn btn-close m-2' 
                            onClick={()=>handleCancel()}/>
                    }
                </div>
                <hr></hr>
                <input id="inputCounty" 
                    className="form-control"
                    placeholder="County name"
                    aria-label="County"
                    onChange={(event)=>handleSearchChange(event)}/>
                <div className="list-group overflow-y-auto" style={{maxHeight: 400}}>
                {
                    candidates.map(
                        (candidate, index)=>
                        <button key={candidate.FIPS}
                            data-fips={candidate.FIPS}
                            className="list-group-item list-group-item-action d-flex" 
                            onClick={
                                (event)=>{reportSelection(event.currentTarget.dataset.fips)}
                            }>
                            {candidate.NAME+", "+candidate.STATE_NAME}
                        </button>
                    )
                }
                </div>
            </div>
        </div>

    </div>
    )
}