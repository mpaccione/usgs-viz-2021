import React from "react";
import { Modal, Button } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { setModalText } from "@/redux/reducers/modalSlice";

const AppModal = ({ modalOpen, setModalOpen }) => {
  const modalText = useSelector((state) => state.modal.modalText);
  const dispatch = useDispatch();

  return (
    <Modal id="modal" dimmer={"blurring"} open={modalOpen}>
      <Modal.Header>{modalText}</Modal.Header>
      <Button
        onClick={() => {
          setModalOpen(false);
          dispatch(setModalText(""));
        }}
      >
        Okay
      </Button>
    </Modal>
  );
};

export default AppModal;
