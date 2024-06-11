import '@arcgis/core/assets/esri/css/main.css';
import './CustomPopup.css';
import './Tooltip.css';
import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point";
import Tooltip from "./Tooltip";

export const HoverMapIntro = (
        {
            countyLayerConfig,
            style, 
            basemap, 
            thematicLayer,
            padding, 
            county:selectedCounty, 
            onSelect:reportSelection, 
            scrollWheel
        }
    )=>{

    const _refView = useRef(null);
    const _layerSelectedCounty = useRef(new GraphicsLayer());
    const _layerHoverCounty = useRef(new GraphicsLayer());
    const _padding = useRef(padding);
    const _reportSelection = useRef(reportSelection);
    const _toolTip = useRef(null)
    const _scrollWheel = useRef(scrollWheel);
    const _countyLayerConfig = useRef(countyLayerConfig);
    const _basemap = useRef(basemap);
    const _thematicLayer = useRef(thematicLayer);

    const [hoverCounty, setHoverCounty] = useState(null);

    const createPopup = (text, x, y) => {
        const div = document.createElement("div");
        div.classList.add("custom-popup");
        div.innerHTML = "<div>"+text+"</div>";
        const screenPoint = _refView.current.toScreen({type: "point", x: x, y: y});
        div.style.left = parseInt(screenPoint.x).toString()+"px";
        div.style.top = parseInt(screenPoint.y).toString()+"px";
        div.setAttribute("data-x", x);
        div.setAttribute("data-y", y);
        return div;
    }

    useEffect(
        () => {

            const map = new Map({basemap: _basemap.current});

            const layerCounties = new FeatureLayer(_countyLayerConfig.current);

            if (_thematicLayer.current) {
                map.add(_thematicLayer.current);
            }
            
            map.add(layerCounties);
            map.add(_layerHoverCounty.current);
            map.add(_layerSelectedCounty.current);

            const view = new MapView(
                {
                    map: map, 
                    container: "view",
                    center: [-109.2, 49.22], 
                    zoom: 3,
                    padding: _padding.current
                }
            );

            if (!_scrollWheel.current) {
                view.on("mouse-wheel", (event) => {
                    event.stopPropagation();
                });    
            }

            view.ui.move("zoom", "top-right");

            view.watch("extent",()=>{
                Array.from(document.getElementsByClassName("custom-popup")).forEach(
                    (element)=> {
                        const screenPoint = view.toScreen(
                            new Point(element.dataset.x, element.dataset.y)
                        );
                        element.style.left = (parseInt(screenPoint.x)-_padding.current.left).toString()+"px";
                        element.style.top = parseInt(screenPoint.y).toString()+"px";     
                    }
                )
            });

            _toolTip.current = new Tooltip(view.container);

            view.on(
                "pointer-move",
                (event)=>{

                    view.hitTest(
                        event, 
                        {include: layerCounties}
                    ).then(
                        (response) => {
                            if (response.results.length > 0) {
                                document.querySelector("#view").style.cursor = "pointer";
                                const graphic = response.results.shift().graphic;
                                setHoverCounty(
                                    (prior)=> 
                                    !prior || prior.attributes.OBJECTID !== graphic.attributes.OBJECTID ? 
                                    graphic : 
                                    prior   
                                );
                                _toolTip.current.show(
                                    "<b>"+graphic.attributes.NAME+"</b>", 
                                    event.x, event.y
                                );
                            } else {
                                document.querySelector("#view").style.cursor = "default";
                                setHoverCounty(null);
                                _toolTip.current.hide();
                            }

                        }
                    )
                }
            );

            view.on(
                "pointer-leave",
                (event)=>{_toolTip.current.hide();/*not working*/}
            );

            view.on(
                "click",
                (event)=>{
                    _toolTip.current.hide();
                    view.hitTest(
                        event,
                        {include: layerCounties}
                    ).then(
                        (response)=>{
                            if (response.results.length) {
                                const graphic = response.results.shift().graphic;
                                _reportSelection.current(graphic.attributes.FIPS || graphic.attributes.GEOID);                                
                            }
                        }
                    )
                }
            )

            _refView.current = view;

        },
        []
    );

    useEffect(
        ()=> {
            
            _layerSelectedCounty.current.removeAll();
            _refView.current.ui.remove(
                Array.from(document.getElementsByClassName("custom-popup"))    
            );

            if (selectedCounty) {

                _layerSelectedCounty.current.add(
                    new Graphic(
                        {
                            geometry: {
                                type: "polygon",
                                rings: selectedCounty.geometry.rings
                            },
                            symbol: {
                                type: "simple-line",  
                                color:  [ 255 , 0, 0, 1]
                            }
                        }
                    )
                )
                _refView.current.goTo(
                    {target: [selectedCounty.centroid.x, selectedCounty.centroid.y], zoom: 8},
                    {animate: true, duration: 1000}
                );    

                _refView.current.ui.add(
                    createPopup(
                        selectedCounty.attributes.NAME, 
                        selectedCounty.centroid.x,
                        selectedCounty.centroid.y
                    )    
                );

            }
        },
        [selectedCounty]
    )

    useEffect(
        ()=>{
            _layerHoverCounty.current.removeAll();
            if (hoverCounty) {
                hoverCounty.symbol = {
                    type: "simple-line",  
                    color:  [0, 0, 0, 1]
                }
                _layerHoverCounty.current.add(hoverCounty);
            }            
        },
        [hoverCounty]
    );

    return <div id="view" className="position-relative" style={style}></div>

}