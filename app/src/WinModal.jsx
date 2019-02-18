import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as s from "./selectors";
import { hideWinModal } from "./actions";
import Modal from "react-bootstrap/Modal";
import winGif from "./img/win.gif";

const WinModal = ({ show, text, hideWinModal }) => (
  <>
    <Modal show={show} onHide={hideWinModal.bind(this)}>
      <Modal.Header closeButton style={{ backgroundColor: "#f0f0f0" }}>
        <Modal.Title />
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center mt-3">
          <span role="img" aria-label="party" style={{ fontSize: "200%" }}>
            🎉 {text}! 🎉
          </span>
        </div>

        <div
          className="d-flex justify-content-center mb-3"
          style={{ fontSize: "80%", opacity: 0.5 }}
        >
          And it's legit, check it on etherscan!
        </div>
        <div className="d-flex justify-content-center mb-5">
          <img src={winGif} alt="celebration!" />
        </div>
      </Modal.Body>
    </Modal>
  </>
);

const mapStateToProps = createStructuredSelector({
  show: s.getWinModalShow,
  text: s.getWinModalText
});

const mapDispatchToProps = {
  hideWinModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WinModal);
