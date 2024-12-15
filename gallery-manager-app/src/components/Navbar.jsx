import { Link, useNavigate } from "react-router-dom";
import { BACKGROUND, GREEN, PURPLE, RED } from "../helpers/colors";

const Navbar = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // حذف کوکی توکن
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-dark navbar-expand-sm shadow-lg"
      style={{ backgroundColor: BACKGROUND }}
    >
      <div className="container">
        <div className="w-100 d-flex align-items-center" style={{justifyContent: userName ? "space-between" : "center"}}>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <div className="navbar-brand">
              وب اپلیکیشن {"  "}
              <span style={{ color: PURPLE }}>عکاسی من</span>{" "}
              <i className="fas fa-camera-retro" style={{ color: PURPLE }} />
            </div>
            {userName ? (
              <p
                className="navbar-brand m-0 d-flex gap-2"
                style={{ color: RED }}
              >
                سلام
                <span className="" style={{ color: GREEN, fontWeight: "bold" }}>
                  {userName}
                </span>{" "}
              </p>
            ) : null}
          </div>

          {userName ? (
            <div>
              <p className="h3 m-0">
                <button
                  onClick={handleLogout}
                  className="btn m-2"
                  style={{ backgroundColor: RED }}
                >
                  خروج
                  <i className="fas fa-door-open mx-2" />
                </button>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
