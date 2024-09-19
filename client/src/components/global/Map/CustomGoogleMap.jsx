import GoogleMapReact from 'google-map-react';
import { FaMapMarkerAlt } from "react-icons/fa";

import React from 'react';

const MapChildComponent = ({  }) => <div >
  <span className='text-danger'><FaMapMarkerAlt size={25}/></span>
  </div>

const CustomGoogleMap = ({item}) => {
    const defaultProps = {
    zoom: 11
  };
  return (
          <div style={{ height: '300px', width: '100%' }}>
                {item?.latitude &&(
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyC_-hLFYGAJC_IBMnFBKZLq2IS1qr7tJgQ" }}
                defaultCenter={{
                lat:parseFloat(item?.latitude),
                lng: parseFloat(item?.longitude)
                }}
                defaultZoom={10}
                >
                <div>
                <MapChildComponent
                  lat={parseFloat(item?.latitude)}
                  lng={parseFloat(item?.longitude)}
                  text="My Marker"
                />
                </div>

            </GoogleMapReact>

        )}

    </div>
  );
}

export default CustomGoogleMap