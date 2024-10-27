import { Link } from "react-router-dom";
import {
  COMMENT,
  CURRENTLINE,
  CYAN,
  FOREGROUND,
  ORANGE,
  PURPLE,
  RED,
  YELLOW,
} from "../../helpers/colors";
import { confirmAlert } from "react-confirm-alert";
import { deleteUser, getAllUsers } from "../../services";

const User = ({ id, name, phone, setData, isAdmin, userName }) => {
  console.log(id);

  const confirmDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            dir="rtl"
            style={{
              backgroundColor: CURRENTLINE,
              border: `1px solid ${PURPLE}`,
              borderRadius: "1em",
            }}
            className="p-4"
          >
            <h1 style={{ color: YELLOW }}>پاک کردن</h1>
            <p style={{ color: FOREGROUND }}>آیا از این کار مطمئنی ؟</p>
            <button
              onClick={async () => {
                await deleteUser(id);
                const updatedData = await getAllUsers();
                setData(updatedData);
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
      },
    });
  };

  return (
    <div className="col-md-4">
      <div style={{ backgroundColor: CURRENTLINE }} className="card">
        <div className="card-body d-flex p-2">
          <div className="row align-items-center d-flex justify-content-center">
            <div className="col">
              <ul className="list-group p-0 mx-1">
                <li className="list-group-item list-group-item-dark">
                  شناسه مشتری : {"  "}
                  <span className="fw-bold">{id}</span>
                </li>
                <li className="list-group-item list-group-item-dark">
                  نام و نام خانوادگی :{"  "}
                  <span className="fw-bold">{name}</span>
                </li>
                <li className="list-group-item list-group-item-dark">
                  شماره موبایل :{"  "}
                  <span className="fw-bold">{phone}</span>
                </li>
              </ul>
            </div>
            <div className="col-md-1 col-sm-1 d-flex flex-column align-items-center">
              {isAdmin ? (
                <>
                  <Link
                    to={`/users/edit`}
                    state={{id, userName, isAdmin}}
                    className="btn my-1"
                    style={{ backgroundColor: CYAN }}
                  >
                    <i className="fa fa-pen" />
                  </Link>
                  <button
                    onClick={() => confirmDelete(id)}
                    className="btn my-1"
                    style={{ backgroundColor: RED }}
                  >
                    <i className="fa fa-trash" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
