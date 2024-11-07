import { Route, Routes, useLocation } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

import {
  AddImage,
  Images,
  Navbar,
  ViewImage,
  EditImage,
  LoginPage,
} from "./components";

import "./App.css";
import {
  CURRENTLINE,
  FOREGROUND,
  PURPLE,
  YELLOW,
  COMMENT,
  GREEN,
  RED,
  BACKGROUND,
} from "./helpers/colors";
import AddUser from "./components/users/AddUser";
import Users from "./components/users/Users";
import EditUser from "./components/users/EditUser";

const App = () => {
  const location = useLocation();

  const confirmDownload = () => {
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
            <h1 style={{ color: YELLOW }}>دانلود فایل</h1>
            <p style={{ color: FOREGROUND }}>
              نوع فایل مدنظر خود را انتخاب کنید :
            </p>
            <button
              onClick={() => {
                onClose();
              }}
              className="btn"
              style={{ backgroundColor: GREEN }}
            >
              PDF <i class="fas fa-file-pdf"></i>
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              className="btn mx-2"
              style={{ backgroundColor: GREEN }}
            >
              PNG <i class="fas fa-file-image"></i>
            </button>
            <button
              onClick={onClose}
              className="btn"
              style={{ backgroundColor: RED }}
            >
              انصراف
            </button>
          </div>
        );
      },
    });
  };

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
              onClick={() => {
                console.log(id);
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
    <div className="App" >
      {(location.pathname !== "/users") && (location.pathname !== "/images") ? (
        <Navbar />
      ) : null}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/images"
          element={
            <Images
              confirmDelete={confirmDelete}
              confirmDownload={confirmDownload}
            />
          }
        />
        <Route path="/images/:userName/add" element={<AddImage />} />
        <Route path="/images/:userName/:imageId" element={<ViewImage />} />
        <Route path="/images/:userName/edit/:imageId" element={<EditImage />} />
        <Route
          path="/users"
          element={<Users confirmDelete={confirmDelete} />}
        />
        <Route path="/users/add" element={<AddUser />} />
        <Route path="/users/edit" element={<EditUser />} />
      </Routes>
    </div>
  );
};

export default App;
