import React, { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";

import TopBar from "../../Components/TopBar/TopBar"
import SideBar from "../../Components/SideBar/SideBar"
import "./style.css";

import { userRows } from "./data";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "user",
    headerName: "User",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="userListUser">
          <img className="userListImg" src={params.row.avatar} alt="" />
          {params.row.username}
        </div>
      );
    },
  },
  { field: "email", headerName: "Email", width: 200 },
  {
    field: "status",
    headerName: "Status",
    width: 120,
  },
  {
    field: "transaction",
    headerName: "Transaction Volume",
    width: 160,
  },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => {
      return (
        <>
        action
          {/* <Link to={"/user/" + params.row.id}>
            <button className="userListEdit">Edit</button>
          </Link>
          <DeleteOutline
            className="userListDelete"
            onClick={() => handleDelete(params.row.id)}
          /> */}
        </>
      );
    },
  },
];

const ManageUser = () => {
  const [user, setUser] = useState({ email: "", password: "", role: "" });
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ queryString: "", filterType: "role" });
  const [loading, setLoading] = useState(false);

  const proxy = 'http://localhost:5000'

  // API calls
  const getUsers = async () => {
    setLoading(true);
    try {
      const url = `${proxy}/admin/manageUser/getUsers`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        setLoading(false);
        setUsers(result.data);
        console.log(result.message);
        return;
      }
      console.log("an Error occured while loading users !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
  const onCreate = async (e) => {
    e.preventDefault();
    try {
      // data validation (yup)
      const url = `${proxy}/admin/manageUser/createUser`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(user)
      });
      // reset form
      setUsers({ email: "", password: "", role: "" });

      if (res.ok) {
        const result = await res.json();
        console.log(result.message);
        return;
      }
      console.log("an Error occured while adding a user !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
  const onEdit = async (userId, userIndex) => {
    try {
      // data validation
      let editedUser = users[userIndex];
      // remove password from obj if do not change
      if (editedUser.password === "") {
        delete editedUser.password;
      }

      const url = `${proxy}/admin/manageUser/editUser/${userId}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(editedUser)
      });

      if (res.ok) {
        const result = await res.json();
        console.log("edited user data: ", result.data);
        console.log(result.message);
        return;
      }
      console.log("an Error occured while editing user !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
  const onDelete = async (userId) => {
    try {
      const url = `${proxy}/admin/manageUser/deleteUser/${userId}`;
      const res = await fetch(url, {
        method: "DELETE"
      });

      if (res.ok) {
        const result = await res.json();

        // remove user data from users
        const new_users_list = users.filter((el) => el._id !== userId);
        setUsers(new_users_list);

        console.log(result.message);
        return;
      }
      console.log("an Error occured while deleting user !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
  const onBlock = async (userId, userIndex) => {
    try {
      const url = `${proxy}/admin/manageUser/blockUser/${userId}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify({ active: !users[userIndex].active })
      });
      
      if (res.ok) {
        const result = await res.json();

        setUsers((prevState) => {
          let newState = [...prevState];

          newState.forEach((item) => {
              if (item._id === userId) {
                item.active = !users[userIndex].active
              }
          });
          return newState;
        })
        console.log("blocked user data: ", result.data);
        console.log(result.message);
        return;
      }
      console.log("an Error occured while blocking user !");

    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
  const onFilter = async (value) => {
    setFilter({ ...filter, queryString: value });
    setLoading(true);

    try {
      const url = `${proxy}/admin/manageUser/filterUsers?queryString=${value}&filterType=${filter.filterType}`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        // setFilter({ ...filter, response: result.data });
        console.log('users: ', result.data)
        setUsers(result.data);
        setLoading(false);
        console.log(result.message);
        return;
      }
      console.log("an Error occured while filtering users !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  // convert date format
  const convertDate = (date) => {
    const new_date = new Date(date).toLocaleDateString("en-US").split(/:| /)[0];
    return new_date;
  };

  const usersOnChange = (e) => {
      setUsers((prevState) => {
          let newState = [...prevState];

          newState.forEach((item) => {
              if (item._id === e.target.id) {
                item[e.target.name] = e.target.value;
              }
          });
          return newState;
      })
  }

  const displayUsersList = (users) => {
    return (
      <table>
        <thead>
          <th>email</th>
          <th> password </th>
          <th>role</th>
          <th>actions</th>
          <th>created</th>
          <th>last edit</th>
        </thead>

        <tbody>
          {users.map((el, index) => (
            <tr key={el._id}>
              <td>
                <input type="email" placeholder="Email" name="email"
                      id={el._id} value={el.email} onChange={e => usersOnChange(e)} />
              </td>
              <td>
                <input type="password" placeholder="Password" name="password"
                      id={el._id} value={el.password} onChange={e => usersOnChange(e)} />
              </td>
              <td>
                <select name="role" defaultValue={el.role} 
                        id={el._id} onChange={e => usersOnChange(e)} >
                  <option value="user"> User </option>
                  <option value="author"> Author </option>
                  <option value="moderator"> Moderator </option>
                  <option value="admin"> Admin </option>
                </select>
              </td>
              <td>
                <button type="submit" className="btn btn-outline-accent" onClick={() => onEdit(el._id, index)}>
                  Edit
                </button>

                <button type="submit" className="btn btn-outline-accent" onClick={() => onDelete(el._id)}>
                  Delete
                </button>
                <button type="submit" className="btn btn-outline-accent" onClick={() => onBlock(el._id, index)}>
                  {el.active && el.active ? "Block" : "unBlock"}
                </button>
              </td>
              <td className="display-date"> { el.createdAt && convertDate(el.createdAt)} </td>
              <td className="display-date"> {el.editedAt ? convertDate(el.editedAt) : "not updated "} </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  const displayAddUser = () => {
    return (
      <form action="POST" className="add-user-form" onSubmit={onCreate}>
        <div className="form-input">
          <label htmlFor="email"> Email </label>
          <input
            type="text"
            placeholder="Email"
            value={user.email}
            name="email"
            id="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <div className="form-input">
          <label htmlFor="password"> Password </label>
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            name="password"
            id="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>

        <div className="form-input">
          <label htmlFor="role"> Role </label>
          <select
            name="role"
            id="role"
            defaultValue={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          >
            <option> set Role </option>
            <option value="user"> User </option>
            <option value="author"> Author </option>
            <option value="moderator"> Moderator </option>
            <option value="admin"> Admin </option>
          </select>
        </div>

        <button type="submit" className="btn btn-accent">
          Add New User
        </button>
      </form>
    );
  };
  const displayUsersFilter = () => {
    return (
      <>
        <input
          type="text"
          placeholder={`Filter by ${filter.filterType}`}
          value={filter.queryString}
          onChange={(e) => onFilter(e.target.value)}
        />

        <select
          defaultValue={filter.filterType}
          onChange={(e) => setFilter({ ...filter, filterType: e.target.value })}
        >
          <option> Filter By </option>
          <option value="email"> Email </option>
          <option value="role"> Role </option>
        </select>
      </>
    );
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
    <TopBar />
    <div className="manage-user-container">
      {/* <h2> Panel of Users Management </h2>
      <div className="add-new-user">
        <h3> Add new User </h3>
        {displayAddUser()}
      </div>

      <div className="display-users">
        <h3> List of Users </h3>
        <div className="filter-users">{displayUsersFilter()}</div>

        { loading ? "Loading... " : 
          users.length > 0 ? displayUsersList(users) :
          <h3> There is not any User </h3>
        }
      </div> */}
      <DataGrid
        rows={userRows}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
      />
    </div>
    <SideBar />
    </>
  );
};

export default ManageUser;