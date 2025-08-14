import React from 'react';

function breadcrumb(props) {
  return (
    <div>
        
        <div className="innerhome">
  <div
    className="home_background parallax-window"
    data-parallax="scroll"
    data-image-src="images/about_background.jpg"
  />
  <div className="home_content">
    <div className="home_title">{props.page}</div>
  </div>
</div>
    </div>
  );
}

export default breadcrumb;