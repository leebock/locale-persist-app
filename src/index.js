import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import IntroApp from './IntroApp';
import PlacardApp from './PlacardApp';
import ThematicApp from './ThematicApp';

const urlSearchString = window.location.search;
const params = new URLSearchParams(urlSearchString);
const page = params.get("page");
let scrollWheel = params.get("scrollWheel") || params.get("scrollwheel");
scrollWheel = scrollWheel === null || (/true/).test(scrollWheel);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {
    page === 'intro' ? <IntroApp onCountyChange={(fips) => localStorage.setItem("fips", fips)} scrollWheel={scrollWheel} /> :
    page === 'placard' ? <PlacardApp/> :
    <ThematicApp onCountyChange={(fips) => localStorage.setItem("fips", fips)} scrollWheel={scrollWheel} />
    }
  </React.StrictMode>
);