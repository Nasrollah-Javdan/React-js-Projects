import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, Navigate, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import jsPDF from "jspdf";
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
} from "./helpers/colors";
import AddUser from "./components/users/AddUser";
import Users from "./components/users/Users";
import EditUser from "./components/users/EditUser";
import ForgetPass from "./components/ForgetPass";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInactive, setIsInactive] = useState(false);
  const [inactivityTime, setInactivityTime] = useState(0);
  const inactivityTimer = useRef(null);
  const intervalRef = useRef(null);
  const logoutTimer = useRef(null);
  const alertShown = useRef(false);

  const resetTimer = () => {
    const token = document.cookie.split(";").find(cookie => cookie.trim().startsWith("token="));
    if (location.pathname === "/" || !token) return; // Skip inactivity check on login page or if no token
    setInactivityTime(0); // Reset inactivity time
    // console.log("Timer reset");
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      setIsInactive(true);
      // console.log("User has become inactive");
    }, 600000); 
  };

  useEffect(() => {
    const token = document.cookie.split(";").find(cookie => cookie.trim().startsWith("token="));
    if (location.pathname === "/" || !token) return; // Skip event listeners on login page or if no token
    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    const handleEvent = () => {
      // console.log("User is active now");
      setIsInactive(false);
      resetTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleEvent);
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleEvent);
      });
    };
  }, [location.pathname]);

  useEffect(() => {
    const token = document.cookie.split(";").find(cookie => cookie.trim().startsWith("token="));
    if (location.pathname === "/" || !isInactive || !token) return; // Skip logging on login page or if not inactive or no token
    intervalRef.current = setInterval(() => {
      setInactivityTime(prevTime => {
        const newTime = prevTime + 1;
        // console.log(`User is inactive for ${newTime} seconds`);
        return newTime;
      });
    }, 1000); // Log every second

    return () => clearInterval(intervalRef.current);
  }, [isInactive, location.pathname]);

  useEffect(() => {
    const token = document.cookie.split(";").find(cookie => cookie.trim().startsWith("token="));
    if (!token) return; // Skip if no token
    if (isInactive) {
      logoutTimer.current = setTimeout(() => {
        if (!alertShown.current) {
          alert("شما به مدت 10 دقیقه هیچ عملیاتی در سایت نداشته اید. به صفحه ورود منتقل میشوید");
          alertShown.current = true; 
        }
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // console.log("User logged out due to inactivity");
        navigate("/");
        alertShown.current = false;
      }, 1000); 
    } else {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    }
  }, [isInactive, navigate]);
  
  const downloadImageAsZip = async (imagePath) => {
    const zip = new JSZip();
    const folder = zip.folder("images");

    // دانلود تصویر
    const response = await fetch(`http://localhost:8081/${imagePath}`, {
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed to fetch image:", response.statusText);
      return;
    }

    const blob = await response.blob();
    const filename = "image." + imagePath.split(".").pop();

    // افزودن فایل به زیپ
    folder.file(filename, blob);

    // ایجاد و دانلود آرشیو زیپ
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "image.zip");
    });

    alert("فایل در حال دانلود است");
  };

  const downloadPDF = async (imagePath) => {
    const link = `http://localhost:8081/${imagePath}`;

    try {
      const response = await fetch(link, {
        credentials: "include", 
      });

      if (!response.ok) {
        console.error("Failed to fetch image:", response.statusText);
        alert("خطا در دانلود تصویر");
        return;
      }

      const blob = await response.blob();
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = URL.createObjectURL(blob); // Create a blob URL for the image

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(canvas.toDataURL("image/jpeg"), "JPEG", 0, 0);
        pdf.save("image.pdf");
        alert("فایل در حال دانلود است");
      };

      img.onerror = () => {
        alert("خطا در دانلود تصویر");
      };
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("خطا در دانلود تصویر");
    }
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
                // console.log(id);
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
      {location.pathname !== "/users" && location.pathname !== "/images" ? (
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
        <Route path="/forgetPass" element={<ForgetPass />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
