import React from "react";
import { images } from "../../assets/images/images";

const Instroduce = () => {
  return (
    <div className="gioiThieu text-center">
      <div className="row">
        <div className="col">
          <img alt="example" className="w-100 mt-5" src={images.gioithieu1} />
        </div>
        <div className="col">
          <img alt=" example" className="w-100 mt-5" src={images.gioithieu2} />
        </div>
      </div>
    </div>
  );
};

export default Instroduce;
