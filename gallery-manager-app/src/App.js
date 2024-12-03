import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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

  const downloadImageAsZip = async (imagePath) => {
    const zip = new JSZip();
    const folder = zip.folder("images");

    // دانلود تصویر
    const response = await fetch(`http://localhost:8081/${imagePath}`);
    const blob = await response.blob();
    const filename = imagePath.split("/").pop();

    // افزودن فایل به زیپ
    folder.file(filename, blob);

    // ایجاد و دانلود آرشیو زیپ
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "images.zip");
    });

    alert("فایل در حال دانلود است");
  };

  const downloadPDF = async (imagePath) => {
    const link = `http://localhost:8081/${imagePath}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = link;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0);
      pdf.save("image.pdf");
      alert("فایل در حال دانلود است");
    };

    img.onerror = () => {
      alert("خطا در بارگذاری تصویر");
    };
  };

  const confirmDownload = (imagePath) => {
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
                downloadPDF(imagePath);
                onClose();
              }}
              className="btn"
              style={{ backgroundColor: GREEN }}
            >
              PDF <i className="fas fa-file-pdf"></i>
            </button>
            <button
              onClick={() => {
                downloadImageAsZip(imagePath);
                onClose();
              }}
              className="btn mx-2"
              style={{ backgroundColor: GREEN }}
            >
              ZIP <i className="fas fa-file-archive"></i>
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
    <div className="App">
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
        <Route path="/images/add" element={<AddImage />} />
        <Route path="/image/imageInfo" element={<ViewImage />} />
        <Route path="/image/edit" element={<EditImage />} />
        <Route
          path="/users"
          element={<Users confirmDelete={confirmDelete} />}
        />
        <Route path="/users/add" element={<AddUser />} />
        <Route path="/users/edit" element={<EditUser />} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/* اضافه کردن Route برای هدایت به صفحه اصلی */}
      </Routes>
    </div>
  );
};

export default App;
