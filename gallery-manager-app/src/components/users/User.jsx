import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { CURRENTLINE, CYAN, FOREGROUND, PURPLE, RED, YELLOW, COMMENT } from "../../helpers/colors";
import { deleteUser, getAllUsers } from "../../services"; // Ensure deleteUser is imported

const User = ({ id, name, phone, setData, isAdmin, userName, currentPage, usersPerPage }) => {
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
                const result = await deleteUser(id);
                // console.log(result);
                if (result.error) {
                  alert(result.error);
                } else {
                  const users = await getAllUsers(currentPage, usersPerPage);
                  setData(users.users || []);
                  alert(result.message);
                }
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
    <div className="col-md-4 my-1">
      <div style={{ width: "", backgroundColor: CURRENTLINE }} className="card">
        <div style={{ height: "170px" }} className="card-body p-2 d-flex align-items-center">
          <div className="row mx-auto">
            <div style={{ width: "80%", padding: "0" }}>
              <ul className="list-group p-0 mx-1" style={{ width: "250px" }}>
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
            <div style={{ width: "20%", padding: "0" }} className="my-auto">
              {isAdmin && (
                <>
                  <Link
                    to={`/users/edit`}
                    state={{ userId : id, userName, isAdmin }}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
