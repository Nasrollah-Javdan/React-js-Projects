import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  CURRENTLINE,
  CYAN,
  GREEN,
  ORANGE,
  PURPLE,
  RED,
  YELLOW,
  FOREGROUND,
  COMMENT
} from "../../helpers/colors";
import { deleteImage, getAllImages } from "../../services/index";

const Image = ({
  photographerName,
  description,
  LoggedUserName,
  setImages,
  imageId,
  imagePath,
  userId,
  userName: Name,
  userPhone,
  confirmDownload,
  isAdmin
}) => {
  const confirmDelete = (imageId) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            dir="rtl"
            style={{
              backgroundColor: CURRENTLINE,
              border: `1px solid ${PURPLE}`,
              borderRadius: "1em"
            }}
            className="p-4"
          >
            <h1 style={{ color: YELLOW }}>پاک کردن</h1>
            <p style={{ color: FOREGROUND }}>آیا از این کار مطمئنی ؟</p>
            <button
              onClick={async () => {
                await deleteImage(imageId);
                const updatedData = await getAllImages();
                setImages(updatedData);
                onClose();
              }}
              className="btn mx-2"
              style={{ backgroundColor: PURPLE }}
            >
              مطمئن هستم
            </button>
            <button
              onClick={onClose}
              className="btn"
              style={{ backgroundColor: COMMENT }}
            >
              انصراف
            </button>
          </div>
        );
      }
    });
  };

  return (
    <div className="col-md-6 mb-2">
      <div style={{ backgroundColor: CURRENTLINE }} className="card h-100">
        <div className="card-body p-2 d-flex align-items-center" style={{height: "220px"}}>
          <div className="row mx-auto">
            <div className="col-md-4 col-sm-5 p-0 my-auto">
              <img
                src={`http://localhost:8081/${imagePath}`}
                alt=""
                style={{ border: `1px solid ${PURPLE}` }}
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-6 col-sm-6 p-0 mx-2 my-auto">
              <ul className="list-group p-0">
                <li className="list-group-item list-group-item-dark">
                  شناسه عکس :{"  "}
                  <span className="fw-bold">{imageId}</span>
                </li>

                <li className="list-group-item list-group-item-dark">
                  شناسه مشتری : {"  "}
                  <span className="fw-bold">{userId}</span>
                </li>

                <li className="list-group-item list-group-item-dark">
                  نام و نام خانوادگی :{"  "}
                  <span className="fw-bold">{Name}</span>
                </li>

                <li className="list-group-item list-group-item-dark">
                  شماره همراه مشتری : {"  "}
                  <span className="fw-bold">{userPhone}</span>
                </li>
              </ul>
            </div>
            <div className="col-md-1 col-sm-1 d-flex flex-column align-items-center mx-auto my-auto">
              <Link
                to={`/image/imageInfo`}
                state={{
                  photographerName,
                  description,
                  LoggedUserName,
                  imageId,
                  imagePath,
                  userId,
                  Name,
                  userPhone,
                  isAdmin
                }}
                className="btn my-1"
                style={{ backgroundColor: ORANGE }}
              >
                <i className="fa fa-eye" />
              </Link>

              {isAdmin ? (
                <>
                  <Link
                    to={`/image/edit`}
                    state={{
                      photographerName,
                      description,
                      LoggedUserName,
                      imageId,
                      imagePath,
                      userId,
                      Name,
                      userPhone,
                      isAdmin
                    }}
                    className="btn my-1"
                    style={{ backgroundColor: CYAN }}
                  >
                    <i className="fa fa-pen" />
                  </Link>
                  <button
                    onClick={() => confirmDelete(imageId)}
                    className="btn my-1"
                    style={{ backgroundColor: RED }}
                  >
                    <i className="fa fa-trash" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => confirmDownload(imagePath)}
                    className="btn my-1"
                    style={{ backgroundColor: GREEN }}
                  >
                    <i className="fas fa-download" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Image;
