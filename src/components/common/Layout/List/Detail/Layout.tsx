import React from "react";
type propsType = {
    HeaderLeft? : any,
    HeaderRight? : any,
    List? : any,
    MainContent :any,
};
export default function Layout({HeaderLeft,HeaderRight,List,MainContent}: propsType): React.JSX.Element {
  return (
    <div className="layoutDetail">
      <div className="layoutDetail--left">
        <div className="layoutDetail--left__head">
            {HeaderLeft && HeaderLeft}
        </div>
        <div className="layoutDetail--left__list">
            {List && List}
        </div>
      </div>
      <div className="layoutDetail--right">
        <div className="layoutDetail--right__head">
            {HeaderRight && HeaderRight}
        </div>
        <div className="layoutDetail--right__mainContent">
            {MainContent}
        </div>
      </div>
    </div>
  );
};


