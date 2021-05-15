import React from 'react';

const Loader: React.FC<{ text?: string }> = ({ text = '' }) => {
  return (
    <div className="flex">
      <div id="splash-screen">
        <div className="center">
          <div className="logo">
            <img src="https://d8bnsroxtx1yg.cloudfront.net/agent3/logo.svg" width="250" alt="logo" />
          </div>

          <div className="preloader">
            <div className="sk-folding-cube">
              <div className="sk-cube1 sk-cube" />
              <div className="sk-cube2 sk-cube" />
              <div className="sk-cube4 sk-cube" />
              <div className="sk-cube3 sk-cube" />
            </div>

            <div className="splash-text">{text}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;