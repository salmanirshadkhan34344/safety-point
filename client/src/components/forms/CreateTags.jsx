import React from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { apiPost } from "../../util/ApiRequest";
import { ENDPOINTS } from "../../util/EndPoint";

const CreateTags = ({ showAddBrandPro, hideAddBrandPro, refreshDataPro }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    apiPost(
      ENDPOINTS.CreateTagByAdmin,
      data,
      (onSuccess) => {
        hideAddBrandPro();
        refreshDataPro();
      },
      (onFailure) => {
        hideAddBrandPro();
        refreshDataPro();
      }
    );
  };
  return (
    <>
      <Modal show={showAddBrandPro} onHide={() => hideAddBrandPro()}>
        <Modal.Header
          closeButton
          className="bg-primary text-white custom-modal-header"
        >
          <Modal.Title className="font-18">Create Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="mb-2">Tag:</label>
            <input
              className="form-control mb-4"
              type="text"
              required
              {...register("name")}
            />
            <button className="btn btn-secondary" type="submit">
              submit
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateTags;
