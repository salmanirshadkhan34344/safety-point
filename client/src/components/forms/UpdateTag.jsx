import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { apiPost } from "../../util/ApiRequest";
import Loader from "../global/Loader";
import { ENDPOINTS } from "../../util/EndPoint";

const UpdateTag = ({
  showUpdateModalPro,
  hideUpdateModalPro,
  selectedItemPro,
  refreshDataPro,
}) => {
  const [loader, setLoader] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    snackStatus: false,
    snackColor: "bg-primary",
    snackMsg: "",
  });

  const nameEl = React.useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const body = new FormData(event.target);

    apiPost(
      ENDPOINTS.UpdateTagByAdmin,
      body,
      (res) => {
        console.log(res, "sssssssss");
        hideUpdateModalPro();
        refreshDataPro();
        setLoader(false);
        setSnackInfo({
          snackStatus: true,
          snackColor: "bg-successful",
          snackMsg: "Successful Updated",
        });
      },
      (error) => {
        hideUpdateModalPro();
        refreshDataPro();
        setLoader(false);
        setSnackInfo({
          snackStatus: true,
          snackColor: "bg-danger",
          snackMsg: "There is an Error Plz Try Again ",
        });
      }
    );
  };

  return (
    <>
      <Modal show={showUpdateModalPro} onHide={() => hideUpdateModalPro()}>
        <Modal.Header
          closeButton
          className="bg-primary text-white custom-modal-header"
        >
          <Modal.Title className="font-18">Update Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input value={selectedItemPro.id} type="hidden" name="tag_id" />
            <label className="mb-2">Name:</label>
            <input
              className="form-control mb-4"
              name="name"
              type="text"
              required
              defaultValue={selectedItemPro?.name}
              ref={nameEl}
              onChange={(e) => (nameEl.current.value = e.target.value)}
            />
            <input className="btn btn-secondary" type="submit" />
          </form>
        </Modal.Body>
      </Modal>
      <div className="">{loader && <Loader />}</div>
    </>
  );
};

export default UpdateTag;
