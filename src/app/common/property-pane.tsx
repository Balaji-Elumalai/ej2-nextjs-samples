import React from 'react';
import {Browser} from "@syncfusion/ej2-base";

const PropertyPane = ({ title, children, isHide = Browser.isDevice }: {title: string, children: React.ReactNode, isHide?: boolean}) => {

  return (
    <div className={`${isHide ? 'sb-hide' : ''} property-panel-section`}>
      <div className="property-panel-header">
        {title}
      </div>
      <div className="property-panel-content">
        {children}
      </div>
    </div>
  );
};

export default PropertyPane;
