import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { queryCountyFeature } from './components/Utils';

function PlacardApp() {

    const [county, setCounty] = useState(null);
    const URL = "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized_Boundaries/FeatureServer/0";

    window.addEventListener(
        "storage", 
        async () => {
            setCounty(await queryCountyFeature(URL, "FIPS", localStorage.getItem("fips")));    
        }
    );

    useEffect(
        ()=>{
            if (localStorage.getItem("fips")) {
                setTimeout(
                    async ()=>setCounty(
                        await queryCountyFeature(URL, "FIPS", localStorage.getItem("fips"))
                    ), 
                    1000
                );
            }
        },
        []
    );
    
    return (
        <div className="vh-100 d-flex flex-column align-items-center justify-content-center">
            {
                county &&
                <div className='d-flex flex-column align-items-center bg-warning p-3 rounded'>
                    <h4 className='text-muted'>Welcome to</h4>
                    <h1 >{county && county.attributes.NAME}</h1>
                    <h2>{county && county.attributes.STATE_NAME}</h2>
                </div>
            }
        </div>
    );
    
}

export default PlacardApp;
