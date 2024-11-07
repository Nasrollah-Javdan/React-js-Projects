import { Link, useLocation } from "react-router-dom";

import Image from "../images/Image";
import Spinner from "../Spinner";
import {
  CURRENTLINE,
  CYAN,
  GREEN,
  ORANGE,
  PINK,
} from "../../helpers/colors";
import Navbar from "../Navbar";

const Images = ({ confirmDelete, confirmDownload }) => {
  const { state } = useLocation();
  const { isAdmin, userName } = state;
  return (
    <>
      <Navbar userName={userName} />
      <section className="container">
        <div className="grid">
          <div className="row">
            {isAdmin ? (
              <div className="col mt-2">
                <p className="h3 float-end">
                  <Link
                    to={`/images/add`}
                    className="btn m-2"
                    style={{ backgroundColor: PINK }}
                  >
                    بارگزاری عکس
                    <i className="fa fa-plus-circle mx-2" />
                  </Link>
                </p>
                <p className="h3 float-end">
                  <Link
                    to={`/users/add`}
                    state={{isAdmin, userName}}
                    className="btn m-2"
                    style={{ backgroundColor: GREEN }}
                  >
                    ایجاد کاربر
                    <i className="fas fa-user-plus mx-2" />
                  </Link>
                </p>

                <p className="h3 float-end">
                  <Link
                    to={"/images"}
                    state= {{isAdmin, userName}}
                    className="btn m-2"
                    style={{ backgroundColor: CYAN }}
                  >
                    مشاهده تصاویر
                    <i className="fas fa-user-edit mx-2" />
                  </Link>
                </p>
                <p className="h3 float-end">
                  <Link
                    to={"/users"}
                    state= {{isAdmin, userName}}
                    className="btn m-2"
                    style={{ backgroundColor: ORANGE }}
                  >
                    مشاهده کاربران
                    <i className="fas fa-users mx-2" />
                  </Link>
                </p>
              </div>
            ) : (
              <div className="my-2"></div>
            )}
          </div>
        </div>
      </section>
      {false ? (
        <Spinner />
      ) : (
        <section className="container">
          <div className="row">
            {false ? (
              <Image
                confirmDelete={() => confirmDelete()}
                confirmDownload={confirmDownload}
                isAdmin={isAdmin}
                userName={userName}
              />
            ) : (
              <div
                className="text-center py-5"
                style={{ backgroundColor: CURRENTLINE }}
              >
                <p className="h3" style={{ color: ORANGE }}>
                  عکسی یافت نشد ...
                </p>
                <img
                  src={require("../../assets/no-found.gif")}
                  alt="پیدا نشد"
                  className="w-25"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Images;
