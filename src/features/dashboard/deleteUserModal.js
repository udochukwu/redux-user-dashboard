/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';

export function DeleteUserModal({
  show,
  handleClose,
  users,
  userToRemove,
  handleDelete,
}) {
  return (
    <>
      <StyledModal
        show={show}
        onHide={() => {
          handleClose();
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this user?{' '}
          {users?.find((user) => user.id === userToRemove)?.email}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </StyledModal>
    </>
  );
}

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 0px;
  }
  input {
    height: 50px;
    border-radius: 0px;
  }
  .submit-btn {
    height: 50px;
    width: 100%;
    font-weight: bold;
  }
  label {
    font-size: 14px;
    font-weight: bold;
  }
`;
