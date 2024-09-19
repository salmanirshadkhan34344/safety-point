
import "./Loader.css";
import { Oval } from "react-loader-spinner";

const Loader = () => {
  return (
    <>
      <div className="global-loader">
        <Oval
          ariaLabel="loading-indicator"
          height={100}
          width={100}
          strokeWidth={5}
          color="#fff"
          className="global-loader-inner"
          secondaryColor="#26282b"
        />
      </div>
    </>
  );
};

export default Loader;
