import "./src/styles/global.css"
import React from 'react';
import CookieConsent from 'react-cookie-consent';
// import { BrowserRouter } from 'react-router-dom';

// export const wrapRootElement = ({ element }) => (
//   <BrowserRouter>
//     {element}
//   </BrowserRouter>
// );

export const wrapPageElement = ({ element }) => (
  <>
    <CookieConsent
      location="bottom"
      buttonText="I agree, dismiss this message"
      cookieName="gatsby-plugin-google-gtag"
      containerClasses="custom-cookie-banner"
      style={{
        background: '#fff', // White background
        color: '#333', // Dark text color
        border: '1px solid #ddd', // Light border for the box
        borderRadius: '8px', // Rounded corners
        padding: '20px', // Padding around the text
        position: 'fixed', // Fix it at the bottom right
        bottom: '10px',
        left: 'unset',
        right: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow
        maxWidth: '400px', // Set a max-width
        zIndex: '1000', // Ensure it's on top of other elements
        fontFamily: 'Arial, sans-serif', // Match the font style
        fontSize: '14px', // Match font size
      }}
      buttonStyle={{
        background: '#e65100', // Orange button background
        color: '#fff', // White button text
        borderRadius: '4px', // Rounded corners for the button
        padding: '10px 20px', // Button padding
        fontSize: '14px', // Button font size
        fontWeight: 'bold', // Bold text
        cursor: 'pointer', // Pointer on hover
      }}
      onAccept={() => {
        //Initially the script will load with text/plain and this will not execute on load, it will be loaded on accept.
        const consentedScripts = document.querySelectorAll('script[type="text/plain"][data-category="analytics"]');
        consentedScripts.forEach(script => {
          const newScript = document.createElement('script');
          newScript.src = script.src;
          document.head.appendChild(newScript);
        });
      }}
    >
    <div className="cookie-container">
      <div className="cookie-logo box1"></div>
      <div className="content box2">
        This website requires cookies, and the limited processing of your personal data in order to function.
      </div>
    </div>
    </CookieConsent>
    {element}
  </>
);