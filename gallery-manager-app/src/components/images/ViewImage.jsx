import { Link, useLocation } from "react-router-dom";

import { CURRENTLINE, CYAN, PURPLE } from "../../helpers/colors";

const ViewImage = () => {
  const location = useLocation();

  const {
    LoggedUserName: userName,
    imageId,
    imagePath,
    userId,
    Name,
    userPhone,
    isAdmin,
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
                    نام مشتری : <span className="fw-bold">{Name}</span>
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
                  state= {{isAdmin, userName}}
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
