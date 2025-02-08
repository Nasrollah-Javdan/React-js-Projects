import { Link, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "..";
import { COMMENT, ORANGE, PURPLE } from "../../helpers/colors";
import { useState, useEffect, useRef } from "react";
import { getAllUsers, editImage } from "../../services";
import { jwtDecode } from "jwt-decode";

const EditImage = () => {
  const location = useLocation();
  const photographerName = location?.state?.photographerName;
  const description = location?.state?.description;
  const imageId = location?.state?.imageId;
  const imagePath = location?.state?.imagePath;
  const userId = location?.state?.userId;
  const userName = location?.state?.userName;
  const userPhone = location?.state?.userPhone;


  const [formData, setFormData] = useState({
    userId,
    userName: userName,
    userNumber: userPhone,
    photographerName,
    description,
    photo: null,
  });
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(
    `http://localhost:8081/${imagePath}`
  );
  const [userInfo, setUserInfo] = useState(null); 
  const alertShown = useRef(false);


  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];    

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo({
          isAdmin: decodedToken.role === "admin" ? 1 : 0,
          userName: decodedToken.userName,
        });
      } catch (error) {
        if(!alertShown.current){
          alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
          alertShown.current = true; 
        }
        navigate("/");
        console.error("Error decoding token:", error);
      }
    } else {
      if(!alertShown.current){
        alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
        alertShown.current = true; 
      }
      navigate("/");
      console.error("No token found in cookies.");
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getAllUsers();
      console.log(usersData, alertShown.current);
      if(usersData == 403){
        if (!alertShown.current) {
          alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
          alertShown.current = true;
        }
        navigate("/");
      }
      setUsers(usersData);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value.length >= 2) {
      // console.log(users);
      const results = users.users.filter(
        (user) =>
          user.userId.toString().includes(value) ||
          user.userName.includes(value)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (userId, userName, userNumber) => {
    setFormData({ ...formData, userId, userName, userNumber });
    setSearchResults([]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      photo: file,
    });
    setPreviewImage(URL.createObjectURL(file));
  };

  const submitForm = async (event) => {
    event.preventDefault();

    const userExists = users.users.some(
      (user) =>
        user.userId === parseInt(formData.userId) &&
        user.userName === formData.userName &&
        user.userNumber === formData.userNumber
    );

    if (!userExists) {
      alert("کاربر در پایگاه داده وجود ندارد.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    // Logging FormData contents to inspect all the fields
    // for (let [key, value] of data.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    try {
      const response = await editImage(imageId, data);
      alert("اطلاعات عکس با موفقیت به‌روزرسانی شد");
      navigate(`/images`);
    } catch (err) {
      console.error(err);
      alert(`خطا در به‌روزرسانی اطلاعات عکس: ${err.message}`);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <section className="p-3">
            <div className="container">
              <div className="row my-2">
                <div className="col text-center">
                  <p className="h4 fw-bold" style={{ color: ORANGE }}>
                    ویرایش مشخصات عکس
                  </p>
                </div>
              </div>
              <hr style={{ backgroundColor: ORANGE }} />
              <div
                className="row p-2 w-75 mx-auto align-items-center"
                style={{ backgroundColor: "#44475a", borderRadius: "1em" }}
              >
                <div className="col-md-8">
                  <form onSubmit={submitForm}>
                    <div className="mb-2">
                      <input
                        name="imageId"
                        type="text"
                        className="form-control"
                        value={imageId}
                        required
                        placeholder="شناسه عکس"
                        disabled
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="photo"
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        placeholder="آدرس تصویر"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="userId"
                        type="text"
                        className="form-control"
                        placeholder="شناسه مشتری"
                        value={formData.userId}
                        onChange={handleSearchInputChange}
                        required
                      />
                      {searchResults.length > 0 && (
                        <ul className="list-group">
                          {searchResults.map((user) => (
                            <li
                              key={user.userId}
                              className="list-group-item list-group-item-action"
                              onClick={() =>
                                handleSelectUser(
                                  user.userId,
                                  user.userName,
                                  user.userNumber
                                )
                              }
                            >
                              {user.userId} - {user.userName} -{" "}
                              {user.userNumber}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="mb-2">
                      <input
                        name="userName"
                        type="text"
                        className="form-control"
                        placeholder="نام مشتری"
                        value={formData.userName}
                        onChange={handleSearchInputChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="userNumber"
                        type="text"
                        className="form-control"
                        required
                        placeholder="شماره همراه مشتری"
                        value={formData.userNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="photographerName"
                        type="text"
                        className="form-control"
                        value={formData.photographerName}
                        // required
                        onChange={handleInputChange}
                        placeholder="نام عکاس"
                      />
                    </div>
                    <div className="mb-2">
                      <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        // required
                        onChange={handleInputChange}
                        placeholder="توضیحات"
                      />
                    </div>
                    <div className="mx-2">
                      <input
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: PURPLE }}
                        value="ویرایش"
                      />
                      <Link
                        to={`/images`}
                        className="btn mx-2"
                        style={{ backgroundColor: COMMENT }}
                      >
                        انصراف
                      </Link>
                    </div>
                  </form>
                </div>
                <div className="col-md-4">
                  <img
                    src={previewImage}
                    className="img-fluid rounded"
                    style={{ border: `1px solid ${PURPLE}` }}
                  />
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

export default EditImage;
