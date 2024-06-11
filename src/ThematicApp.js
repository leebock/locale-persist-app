import 'bootstrap/dist/css/bootstrap.min.css';
import { HoverMapThematic } from './components/HoverMapThematic';
import jsonCounties from "./data/counties.json";
import { useState, useEffect } from 'react';
import { LocatorImage, queryCountyFeature } from './components/Utils';
import { CountySelect } from './components/CountySelect';
import ImageryLayer from "@arcgis/core/layers/ImageryLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";

function ThematicApp({onCountyChange:reportCountyChange, scrollWheel}) {

  const [showLocator, setShowLocator] = useState(false);
  const [county, setCounty] = useState(null);
  const [firstPick, setFirstPick] = useState(false);
  const [thematic, setThematic] = useState("drought");

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

      window.addEventListener(
        "hashchange", 
        e => setThematic(window.location.hash.replace("#","").trim())
      );

    },
    []
  );
  
  return (
    <div className="App d-flex flex-column vh-100 align-items-center overflow-hidden">
      <section className="flex-grow-1 w-100 d-flex flex-column flex-lg-row justify-content-center overflow-hidden position-relative">
        <HoverMapThematic
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
          padding={{}}
          basemap={"gray-vector"}
          thematicLayer={
            thematic === "modis"
            ? new ImageryLayer(
                {
                  url: "https://civsci.esrigc.com/image/rest/services/MODIS_LST/ImageServer",
                  opacity: 0.7
                }
              )

            : thematic === "landcover"
            ? new ImageryTileLayer(
                {
                  url: "https://tiledimageservices.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/European_Space_Agency_WorldCover_2020_Land_Cover_220202a/ImageServer",
                  opacity: 0.7
                }
              )
            : thematic === "aspect" 
            ? new ImageryLayer(
                {
                    url:"https://elevation.arcgis.com/arcgis/rest/services/WorldElevation/Terrain/ImageServer",
                    opacity: 0.7,
                    rasterFunction: {
                      functionName: "Aspect_Map"
                    },
                    customParameters:{
                      token: "AAPKb4dd38a0cc464df48fe57ade48d43babV1zY0xPMJuNx59g4jVh4MYvubEv-kqNHXMwMBhatYgczY4YJkYF4o4XzQjsnK8dp"
                    }
                }
              )
            : new FeatureLayer(
                {
                  url:"https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/US_Drought_Intensity_v1/FeatureServer/3",
                  opacity: 0.7
                }
              )

          }
          county={county} 
          onSelect={handleCountySelect}
          scrollWheel={scrollWheel}/>
        {   
        showLocator ? 
        <CountySelect counties={jsonCounties}
                    showCloseButton={!firstPick}
                    onCancel={()=>{if (!firstPick) {setShowLocator(false)}}}
                    onSelect={handleCountySelect}/> :
        <button type="button" 
            className="btn btn-light position-absolute" 
            style={{zIndex: 1000, right: "75px", top: "10px"}}
            onClick={()=>setShowLocator(true)}>
            <LocatorImage/>
        </button>
        }
      </section>
    </div>
  );
}

export default ThematicApp;