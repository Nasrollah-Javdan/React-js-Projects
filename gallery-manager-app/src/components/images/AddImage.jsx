import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { getAllUsers, searchUsers, getLastImageId } from "../../services/index";
import { Spinner } from "..";
import { COMMENT, GREEN, PURPLE } from "../../helpers/colors";
import { jwtDecode } from "jwt-decode"; // Correct default import

const AddImage = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    userNumber: "",
    photographerName: "",
    description: "",
  });
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newImageId, setNewImageId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const [userInfo, setUserInfo] = useState(null); // Initialize as null

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Correct default import usage
        setUserInfo({
          isAdmin: decodedToken.role === "admin" ? 1 : 0, // Ensure boolean
          userName: decodedToken.userName
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found in cookies.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await getAllUsers();
      setUsers(usersData);
      const lastImageId = await getLastImageId();
      setNewImageId(lastImageId + 1);
      setLoading(false);
    };
    fetchData();
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
      const results = await searchUsers(value);
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
    setFile(file);

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
  };

  const createImage = async (e) => {
    e.preventDefault();
    const userExists = users.some(
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
    data.append("fileToUpload", file);
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post("http://localhost:8081/upload", data);
      alert("عکس با موفقیت بارگزاری شد");
      navigate("/images");
    } catch (err) {
      console.error(err);
      alert(" خطایی در هنگام بارگزاری رخ داد . لطفا دوباره تلاش کنید");
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <section className="p-2">
            <img
              src={uploadedImage || require("../../assets/man-taking-note.png")}
              height="400px"
              style={{
                position: "absolute",
                zIndex: "-1",
                top: "130px",
                left: uploadedImage ? "300px" : "100px",
              }}
            />
            <div className="container">
              <div className="row">
                <div className="col">
                  <p
                    className="h4 fw-bold text-center"
                    style={{ color: GREEN }}
                  >
                    بارگزاری عکس جدید
                  </p>
                </div>
              </div>
              <hr style={{ backgroundColor: GREEN }} />
              <div className="row mt-5">
                <div className="col-md-4">
                  <form onSubmit={createImage}>
                    <div className="mb-2">
                      <input
                        name="newImageId"
                        type="text"
                        className="form-control"
                        value={newImageId || ""}
                        disabled
                        placeholder="شناسه عکس"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="fileToUpload"
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        required
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
                              {user.userId} - {user.userName} - {user.userNumber}
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
                        type="text"
                        name="photographerName"
                        className="form-control"
                        required
                        placeholder="نام عکاس"
                        value={formData.photographerName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-2">
                      <textarea
                        name="description"
                        className="form-control"
                        required
                        placeholder="توضیحات"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mx-2">
                      <input
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: PURPLE }}
                        value="بارگزاری"
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
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default AddImage