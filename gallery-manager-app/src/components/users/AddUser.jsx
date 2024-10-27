import { Link, useLocation, useNavigate } from "react-router-dom";

import { Spinner } from "..";
import { COMMENT, GREEN, PURPLE } from "../../helpers/colors";
import { addUser } from "../../services";
import { useState } from "react";
const AddUser = () => {
  const location = useLocation();
  const { userName, isAdmin } = location.state;
  const navigate = useNavigate();
  const [user, setUser] = useState({ userName: '', userNumber: '', userPassword: '', isAdmin: '0' });
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, isAdmin: '0' });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.userPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const addedUser = await addUser(user);
    alert(`User created with ID: ${addedUser.userId}`);
    navigate(`/users`, {state: {userName, isAdmin}});
  };
  

  return (
    <>
      <section className="p-3">
        <img
          src={require("../../assets/man-taking-note.png")}
          height="400px"
          style={{
            position: "absolute",
            zIndex: "-1",
            top: "130px",
            left: "100px",
            opacity: "50%",
          }}
        />
        <div className="container">
          <div className="row">
            <div className="col">
              <p className="h4 fw-bold text-center" style={{ color: GREEN }}>
                ایجاد کاربر جدید
              </p>
            </div>
          </div>
          <hr style={{ backgroundColor: GREEN }} />
          <div className="row mt-5">
            <div className="col-md-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <input
                    name="userName"
                    type="text"
                    className="form-control"
                    required={true}
                    placeholder="نام مشتری"
                    value={user.userName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-2">
                  <input
                    name="userNumber"
                    type="text"
                    className="form-control"
                    required={true}
                    placeholder="شماره همراه مشتری"
                    value={user.userNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-2">
                  <input
                    name="userPassword"
                    type="password"
                    className="form-control"
                    required={true}
                    placeholder="رمز عبور"
                    value={user.userPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="password"
                    className="form-control"
                    required={true}
                    placeholder="تکرار رمز"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
                <div className="mx-2">
                  <input
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: PURPLE }}
                    value="ایجاد"
                  />
                  <Link
                    to={`/users`}
                    state={{userName, isAdmin}}
                    className="btn mx-2"
                    style={{ backgroundColor: COMMENT }}
                  >
                    انصراف
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddUser;
