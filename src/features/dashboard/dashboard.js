import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addUser,
  removeUser,
  updateUser,
  fetchUsersAsync,
  selectUsers,
  selectStatus,
} from './dashboardSlice';
import { toast } from 'react-toastify'

import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';
import { NewUserModal } from './newUserModal';
import { EditUserModal } from './editUserModal';
export function Dashboard() {
  const users = useSelector(selectUsers);
  const status = useSelector(selectStatus);
  const dispatch = useDispatch();
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [computedUsers, setComputedUsers] = useState(users);
  const [userToRemove, setUserToRemove] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  useEffect(() => {
    setComputedUsers(users);
  }, [users]);

  const createNewUser = (user) => {
    const lastId = users?.slice(-1)[0]?.id || 0;
    dispatch(
      addUser({ id: lastId + 1, address: { city: user?.city }, ...user })
    );
    setShowUserFormModal(false);
    toast.success('User Created.')
  };

  const editUser = (user) => {
    dispatch(
      updateUser({ id: userToEdit?.id, address: { city: user?.city }, ...user })
    );
    setShowEditModal(false);
    toast.success('User Updates.')
  };

  return (
    <>
      <StyledDashboard>
        <NewUserModal
          show={showUserFormModal}
          handleClose={() => setShowUserFormModal(false)}
          submit={createNewUser}
        />
        <EditUserModal
          show={showEditModal}
          handleClose={() => {
            setShowEditModal(false)
          }}
          defaultValue={userToEdit}
          submit={editUser}
        />
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
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
            <Button
              variant='secondary'
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant='danger'
              onClick={() => {
                setShowDeleteModal(false);
                dispatch(removeUser(userToRemove));
                toast.success('User Deleted.')
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <div className='container'>
          <h1 className='fw-bold mb-5'>Dashboard</h1>
          <div className='card'>
            <div className='card-header d-flex justify-content-between align-items-center fw-bold'>
              <span>User List</span>{' '}
              <button
                type='button'
                className='btn btn-primary btn-sm fw-bold'
                onClick={() => setShowUserFormModal(true)}
              >
                Add New
              </button>
            </div>
            <div className='card-body'>
              {status === 'loading' ? (
                <div className='d-flex justify-content-center py-5'>
                  <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                </div>
              ) : (
                <div className='table-responsive'>
                  <table className='table table-striped table-bordered align-middle'>
                    <thead>
                      <tr>
                        <th scope='col'>id</th>
                        <th scope='col'>Name</th>
                        <th scope='col'>Username</th>
                        <th scope='col'>Email</th>
                        <th scope='col'>City</th>
                        <th scope='col'>Edit</th>
                        <th scope='col'>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {computedUsers?.map((user, index) => (
                        <tr key={user?.id}>
                          <th scope='row'>{user?.id}</th>
                          <td>{user?.name}</td>
                          <td>{user?.username}</td>
                          <td>{user?.email}</td>
                          <td>{user?.address?.city}</td>
                          <td>
                            <button
                              type='button'
                              className='btn btn-warning btn-sm fw-bold'
                              onClick={() => {
                                setUserToEdit(user);
                                setShowEditModal(true);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn btn-danger btn-sm fw-bold'
                              onClick={() => {
                                setUserToRemove(user.id);
                                setShowDeleteModal(true);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </StyledDashboard>
    </>
  );
}

const StyledDashboard = styled.main`
  width: 100%;
  padding: 100px 0px;
  tbody {
    border-top: none !important;
  }
  td,
  th {
    padding: 2rem 1rem;
  }
  button {
    border-radius: 0px;
  }
`;
