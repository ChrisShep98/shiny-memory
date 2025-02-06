import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";

// You can copy and pasted querys/mutations from graphql playground
// can pick and choose what you want to get back from the request which is the beauty of graphql
const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      age
      isMarried
    }
  }
`;

const GET_USERS_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      age
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const {
    data: getAllUsers,
    loading: getUsersLoading,
    error: getAllUsersError,
  } = useQuery(GET_USERS);

  const {
    data: getUserByIdData,
    loading: getUsersByIdLoading,
    error: getUsersByIdError,
  } = useQuery(GET_USERS_BY_ID, {
    variables: { id: 2 },
  });

  const [newUser, setNewUser] = useState({});

  const [createUser] = useMutation(CREATE_USER);

  if (getUsersLoading) return <p>loading</p>;
  if (getAllUsersError) return <p>Error: {error.message}</p>;
  if (getUsersByIdLoading) return <p>loading</p>;
  if (getUsersByIdError) return <p>Error: {error.message}</p>;

  const handleCreateUser = async () => {
    console.log(newUser);
    createUser({
      variables: { name: newUser.name, age: newUser.age, isMarried: false },
    });
  };

  return (
    <>
      <div>
        <input
          placeholder="name"
          onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
        ></input>

        <input
          placeholder="age"
          type="number"
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: Number(e.target.value) }))
          }
        ></input>
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      <h1>Users</h1>
      <div>
        <h1>Chosen User: {getUserByIdData.getUserById.name}</h1>
      </div>
      <div>
        {getAllUsers.getUsers.map((user) => {
          return (
            <div key={user.id}>
              <p>Name: {user.name}</p>
              <p>Age: {user.age}</p>
              <p>Is this user married? {user.isMarried ? "yes" : "no"}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
