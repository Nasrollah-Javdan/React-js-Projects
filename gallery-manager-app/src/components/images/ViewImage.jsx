import { Link, useLocation, useNavigate } from "react-router-dom";

import { CURRENTLINE, CYAN, PURPLE } from "../../helpers/colors";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";

const ViewImage = () => {
  const location = useLocation();
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

  const {
    imageId,
    imagePath,
    userId,
    userName,
    userPhone,
    photographerName,
    description,
  } = location.state;

  return (
    <>
      <section className="view-contact-intro p3">
        <div className="container">
          <div className="row my-2 text-center">
            <p className="h3 fw-bold" style={{ color: CYAN }}>
              اطلاعات عکس
            </p>
          </div>
        </div>
      </section>

      <hr style={{ backgroundColor: CYAN }} />

      <>
        <section className="view-contact mt-e">
          <div
            className="container p-2"
            style={{ borderRadius: "1em", backgroundColor: CURRENTLINE }}
          >
            <div className="row align-items-center">
              <div className="col-md-3">
                <img
                  src={`http://localhost:8081/${imagePath}`}
                  alt=""
                  className="img-fluid rounded"
                  style={{ border: `1px solid ${PURPLE}` }}
                />
              </div>
              <div className="col-md-9">
                <ul className="list-group">
                  <li className="list-group-item list-group-item-dark">
                    شناسه عکس : <span className="fw-bold">{imageId}</span>
                  </li>
                  <li className="list-group-item list-group-item-dark">
                    شناسه مشتری : <span className="fw-bold">{userId}</span>
                  </li>
                  <li className="list-group-item list-group-item-dark">
                    نام مشتری : <span className="fw-bold">{userName}</span>
                  </li>
                  <li className="list-group-item list-group-item-dark">
                    شماره همراه مشتری :{" "}
                    <span className="fw-bold">{userPhone}</span>
                  </li>
                  <li className="list-group-item list-group-item-dark">
                    نام عکاس : <span className="fw-bold">{photographerName}</span>
                  </li>
                  <li className="list-group-item list-group-item-dark">
                    توضیحات : <span className="fw-bold">{description}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row my-2">
              <div className="d-grid gap-2 col-6 mx-auto">
                <Link
                  to={`/images`}
                  className="btn"
                  style={{ backgroundColor: PURPLE }}
                >
                  برگشت به نگارخانه
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
};

export default ViewImage;
