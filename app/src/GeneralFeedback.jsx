import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Alert from "react-bootstrap/Alert";

const GeneralFeedback = ({ type, text }) => (
  <Alert variant={type}>{text}</Alert>
);

const mapStateToProps = createStructuredSelector({
  type: state => (state.feedback || {}).type,
  text: state => (state.feedback || {}).text
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneralFeedback);
