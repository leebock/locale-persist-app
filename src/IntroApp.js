import 'bootstrap/dist/css/bootstrap.min.css';
import { HoverMapIntro } from './components/HoverMapIntro';
import jsonCounties from "./data/counties.json";
import { useState } from 'react';
import { queryCountyFeature } from './components/Utils';
import { CountySelect } from './components/CountySelect';

function IntroApp({onCountyChange:reportCountyChange, scrollWheel}) {

  const [showLocator, setShowLocator] = useState(true);
  const [county, setCounty] = useState(null);
  const [firstPick, setFirstPick] = useState(true);

  const URL = "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized_Boundaries/FeatureServer/0";

  window.addEventListener(
    "storage", 
    async () => setCounty(await queryCountyFeature(URL, "FIPS", localStorage.getItem("fips")))
  );

  const handleCountySelect = async (fips)=> {
    reportCountyChange(fips);
    setCounty(await queryCountyFeature(URL, "FIPS", fips));
    setShowLocator(false);
    setFirstPick(false);
  }

  return (
    <div className="App d-flex flex-column vh-100 align-items-center overflow-hidden">
      <section className="flex-grow-1 w-100 d-flex flex-column flex-lg-row justify-content-center overflow-hidden position-relative">
        <HoverMapIntro
                countyLayerConfig={

                  
                    {
                      url:"https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized_Boundaries/FeatureServer/0",
                      outFields: ["NAME", "FIPS"],
                      opacity: 0.5,
                      minScale: 30000000,
                      renderer: {
                          type: "simple",
                          symbol: {
                              type: "simple-fill",  
                              color:  [0, 0, 0, 0],
                              outline: {
                                  color: "gray",
                                  width: 0.5
                              }
                          }
                      }
                    }


                } 
                style={{flex: 1}} 
                basemap={"gray-vector"}
                padding={{left: 425}} 
                county={county} 
                onSelect={handleCountySelect}
                scrollWheel={scrollWheel}/>
        {
        county &&
        <div className='p-3 position-absolute d-flex flex-column bg-light border border-dark-subtle overflow-hidden' 
            style={{left: 10, top: 10, "--bs-bg-opacity": 0.5, maxWidth: 500, maxHeight: "95%"}}>
          <h3>{county.attributes.NAME}, {county.attributes.STATE_NAME}</h3>
          <div className="mt-2">
            Click on the map to change reporting county, OR 
            <button className='btn btn-link p-0 ms-1 me-1' style={{marginTop: -5}}
                  onClick={()=>setShowLocator(true)}>click here</button>
            to type a new county name.
          </div>          
        </div>
        }
        {
        showLocator &&
        <CountySelect counties={jsonCounties}
                showCloseButton={!firstPick}
                onCancel={()=>{if (!firstPick) {setShowLocator(false)}}}
                onSelect={handleCountySelect}/>
        }
      </section>
    </div>
  );
}

export default IntroApp;
