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
import { toast } from 'react-toastify';
import cx from 'classnames';
import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';
import { NewUserModal } from './newUserModal';
import { EditUserModal } from './editUserModal';
import { DeleteUserModal } from './deleteUserModal';
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
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('id');

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  useEffect(() => {
    setComputedUsers(users);
  }, [users]);

  const sort = ({ users, _sortBy, _sortOrder }) => {
    return [...users].sort(function (a, b) {
      const textA =
        typeof a[_sortBy] === 'number' ? a[_sortBy] : a[_sortBy]?.toLowerCase();
      const textB =
        typeof b[_sortBy] === 'number' ? b[_sortBy] : b[_sortBy]?.toLowerCase();

      if (textA < textB) {
        return _sortOrder === 'asc' ? -1 : 1;
      }
      if (textA > textB) {
        return _sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  useEffect(() => {
    const sortedUsers = users
      ? sort({
          users: users.map((user) => ({ ...user, city: user?.address?.city })),
          _sortBy: sortBy,
          _sortOrder: sortOrder,
        })
      : null;
    setComputedUsers(sortedUsers);
  }, [sortBy, sortOrder, users]);

  const createNewUser = (user) => {
    const lastId = users?.slice(-1)[0]?.id || 0;
    dispatch(
      addUser({ id: lastId + 1, address: { city: user?.city }, ...user })
    );
    setShowUserFormModal(false);
    toast.success('User Created');
  };

  const editUser = (user) => {
    dispatch(
      updateUser({ id: userToEdit?.id, address: { city: user?.city }, ...user })
    );
    setShowEditModal(false);
    toast.success('User Updated');
  };

  const deleteUser = (user) => {
    setShowDeleteModal(false);
    dispatch(removeUser(userToRemove));
    toast.success('User Deleted');
  };

  const toggleSortOrder = (_sortBy) => {
    setSortBy(_sortBy);
    setSortOrder(sortOrder === 'asc' && _sortBy === sortBy ? 'desc' : 'asc');
  };

  const tableHeaders = [
    { name: 'id', sort: true },
    { name: 'name', sort: true },
    { name: 'username', sort: true },
    { name: 'email', sort: true },
    { name: 'city', sort: true },
    { name: 'edit', sort: false },
    { name: 'delete', sort: false },
  ];
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
            setShowEditModal(false);
          }}
          defaultValue={userToEdit}
          submit={editUser}
        />
        <DeleteUserModal
          show={showDeleteModal}
          handleClose={() => {
            setShowDeleteModal(false);
          }}
          users={users}
          handleDelete={deleteUser}
          userToRemove={userToRemove}
        />
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
                  <table className='table table-stripe table-bordered align-middle'>
                    <thead>
                      <tr>
                        {tableHeaders.map((header, index) => (
                          <th
                            scope='col'
                            onClick={() => toggleSortOrder(header.name)}
                            key={index}
                          >
                            <div className='d-flex justify-content-between align-items-center'>
                              <span>{header.name}</span>
                              {header.sort && (
                                <div className='sort-box ms-5'>
                                  <div className='sort-item'>
                                    <i
                                      className={cx('fas fa-caret-up ', {
                                        active:
                                          sortOrder === 'asc' &&
                                          sortBy === header.name,
                                      })}
                                    ></i>
                                  </div>
                                  <div className='sort-item'>
                                    <i
                                      className={cx('fas fa-caret-down ', {
                                        active:
                                          sortOrder === 'desc' &&
                                          sortBy === header.name,
                                      })}
                                    ></i>
                                  </div>
                                </div>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {computedUsers?.map((user, index) => (
                        <tr key={user?.id}>
                          <td>{user?.id}</td>
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
  table {
    border: 1px solid #e9ecef;
    font-size: 13px;
  }
  tbody {
    border-top: none !important;
  }

  th {
    padding: 1rem 1rem;
    vertical-align: middle;
    cursor: pointer;
  }
  td {
    padding: 2rem 1rem;
    border: none;
  }
  button {
    border-radius: 0px;
  }
  .sort-box {
    .sort-item {
      cursor: pointer;
      i {
        color: #cacaca;
        &.active {
          color: #000000;
        }
      }
    }
  }
`;
