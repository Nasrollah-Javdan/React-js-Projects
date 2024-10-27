import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "..";
import { COMMENT, ORANGE, PURPLE } from "../../helpers/colors";
import { editUser, getUser } from "../../services";

const EditUser = () => {
  const location = useLocation();
  const { id: userId, userName, isAdmin } = location.state;
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userName: "",
    userNumber: "",
    userPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUser(userId);
      setUser({
        userName: result.userName,
        userNumber: result.userNumber,
        userPassword: result.userPassword,
        confirmPassword: result.userPassword,
      });
    };
    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user.userPassword !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const updatedUser = {
      userName: user.userName,
      userNumber: user.userNumber,
      userPassword: user.userPassword,
    };
    await editUser(userId, updatedUser);
    navigate(`/users`, {state: {userName, isAdmin}});
  };

  return (
    <>
      {false ? (
        <Spinner />
      ) : (
        <>
          <section className="p-3">
            <div className="container">
              <div className="row my-2">
                <div className="col text-center">
                  <p className="h4 fw-bold" style={{ color: ORANGE }}>
                    ویرایش مشخصات کاربر
                  </p>
                </div>
              </div>
              <hr style={{ backgroundColor: ORANGE }} />
              <div
                className="row p-2 w-75 mx-auto align-items-center"
                style={{ backgroundColor: "#44475a", borderRadius: "1em" }}
              >
                <div className="col-md">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <input
                        name="userName"
                        type="text"
                        className="form-control"
                        value={user.userName}
                        onChange={handleInputChange}
                        required={true}
                        placeholder="نام مشتری"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="userNumber"
                        type="text"
                        className="form-control"
                        value={user.userNumber}
                        onChange={handleInputChange}
                        required={true}
                        placeholder="شماره همراه مشتری"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="userPassword"
                        type="password"
                        className="form-control"
                        value={user.userPassword}
                        onChange={handleInputChange}
                        required={true}
                        placeholder="رمز"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="confirmPassword"
                        type="password"
                        className="form-control"
                        value={user.confirmPassword}
                        onChange={handleInputChange}
                        required={true}
                        placeholder="تکرار رمز"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: PURPLE }}
                        value="ویرایش"
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
            <div className="text-center mt-1">
              <img
                src={require("../../assets/man-taking-note.png")}
                height="300px"
                style={{ opacity: "60%" }}
              />
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default EditUser;
