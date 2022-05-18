import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useRef, useState } from "react";

const MutationQuery = gql`
  mutation ($name: String, $rocket: String) {
    insert_users(objects: { name: $name, rocket: $rocket }) {
      returning {
        name
        rocket
      }
    }
  }
`;
const EDIT = gql`
  mutation ($id: uuid, $name: String, $rocket: String) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { name: $name, rocket: $rocket }
    ) {
      affected_rows
    }
  }
`;
const FETCH_DATA = gql`
  query {
    users {
      name
      id
      rocket
    }
  }
`;

const DELETE_DATA = gql`
  mutation ($id: uuid) {
    delete_users(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;
const Mutation = () => {
  const RocketName = useRef();
  const UserName = useRef();
  const [sendData] = useMutation(MutationQuery);
  const [deleteData] = useMutation(DELETE_DATA);
  const [editData] = useMutation(EDIT);
  const [update, setUpdate] = useState({
    id: null,
    showUpdate: false,
  });

  const {
    data: userData,
    loading: userLoading,
    refetch,
  } = useQuery(FETCH_DATA);
  const clickHandler = (e) => {
    e.preventDefault();
    const name = UserName.current.value;
    const rocket = RocketName.current.value;
    sendData({
      variables: {
        name: name,
        rocket: rocket,
      },
      onCompleted: () => {
        refetch();
      },
    });
  };

  const deleteHandler = (id) => {
    deleteData({
      variables: {
        id: id,
      },
      update: (cache, { data }) => {
        console.log(data);
        const { users } = cache.readQuery({
          query: FETCH_DATA,
        });
        console.log(users);
        const newArray = users.filter((user) => {
          if (user.id !== id) {
            return true;
          } else {
            return false;
          }
        });
        cache.writeQuery({
          query: FETCH_DATA,
          data: {
            users: newArray,
          },
        });
      },
      onCompleted: () => {
           // refetch();
      },
    });
  };
  const updateHandler = () => {
    editData({
      variables: {
        id: update.id,
        name: UserName.current.value,
        rocket: RocketName.current.value,
      },
      onCompleted: () => {
        UserName.current.value = "";
        RocketName.current.value = "";
        setUpdate({ id: null, showUpdate: false });
        refetch();
      },
    });
  };
  const editHandler = (id, name, rocket) => {
    setUpdate({
      showUpdate: true,
      id: id,
    });
    UserName.current.value = name;
    RocketName.current.value = rocket;
  };
  return (
    <>
      {userLoading ? (
        <h1>Loading....</h1>
      ) : (
        <>
          <form
            className="border mx-auto mt-3"
            style={{ width: "550px", height: "210px" }}
          >
            <h3 className="mt-2">User Form</h3>
            <div className="m-3 mx-auto" style={{ width: "450px" }}>
              <div className="col mb-2">
                <input
                  type="text"
                  ref={UserName}
                  className="form-control"
                  placeholder="User Name"
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  ref={RocketName}
                  className="form-control"
                  placeholder="Rocket Name"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={!update.showUpdate ? clickHandler : updateHandler}
              className="btn btn-primary mb-3"
            >
              {!update.showUpdate ? "Submit" : "Update"}
            </button>
          </form>

          <ul className="list">
            {userData.users.map((user) => {
              return (
                <div key={Math.random().toString()}>
                  <div className="py-5">
                    <div className="container">
                      <div className="row hidden-md-up">
                        <div className="col-md-4">
                          <div className="card" style={{ width: "200px" }}>
                            <div className="card-block">
                              <h4 className="card-title">User: {user.name}</h4>
                              <h6 className="card-subtitle text-muted">
                                Rocket: {user.rocket}
                              </h6>
                              <div className="m-3">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={editHandler.bind(
                                    null,
                                    user.id,
                                    user.name,
                                    user.rocket
                                  )}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={deleteHandler.bind(null, user.id)}
                                  type="button"
                                  className="btn btn-danger"
                                  style={{ marginLeft: "10px" }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default Mutation;
