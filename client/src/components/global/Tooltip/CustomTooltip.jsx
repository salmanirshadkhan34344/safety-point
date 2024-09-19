import React from 'react'
import { Button, Overlay, Tooltip } from 'react-bootstrap';

const CustomTooltip = ({ descriptionPro }) => {
  const [show, setShow] = React.useState(false);
  const target = React.useRef(null);
  return (
    <>

      <Button
        ref={target}
        onClick={() => setShow(!show)}
        className="btn btn-secondary"
      >
        <span className="services-para">{descriptionPro ? descriptionPro : '-'}</span>
      </Button>
      <Overlay placement="top" target={target.current} show={show}>
        {(props) => (
          <Tooltip
            id="overlay-example"
            className="description-tooltip"
            {...props}
          >
            {descriptionPro ? descriptionPro : '-'}
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

export default CustomTooltip