import React from 'react';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().trim().email().required(),
});

export function NewUserModal({ show, handleClose, submit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => submit(data);

  return (
    <>
      <StyledModal show={show} onHide={() => handleClose()} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add new User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-3'>
              <label htmlFor='name' className='form-label'>
                Name
              </label>
              <input
                type='text'
                className='form-control'
                id='name'
                {...register('name')}
              />

              {errors.name && (
                <div className='invalid-feedback d-block'>
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className='mb-3'>
              <label htmlFor='username' className='form-label'>
                Username
              </label>
              <input
                type='text'
                className='form-control'
                id='username'
                {...register('username')}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>
                Email address
              </label>
              <input
                type='email'
                className='form-control'
                id='email'
                {...register('email')}
              />
              {errors.email && (
                <div className='invalid-feedback d-block'>
                  {errors.email.message}
                </div>
              )}
            </div>
            <div className='mb-3'>
              <label htmlFor='city' className='form-label'>
                City
              </label>
              <input
                type='text'
                className='form-control'
                id='city'
                {...register('city')}
              />
            </div>
            <button type='submit' className='btn btn-primary submit-btn'>
              Submit
            </button>
          </form>
        </Modal.Body>
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
