import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "..";
import { COMMENT, ORANGE, PURPLE } from "../../helpers/colors";
import { editUser, getUser } from "../../services";
import { useFormik } from "formik";
import * as Yup from "yup";

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: userId, userName, isAdmin } = location.state;

  const [user, setUser] = useState({
    userName: "",
    userNumber: "",
    userPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUser(userId);
      setUser({
        userName: result.userName,
        userNumber: result.userNumber,
        userPassword: result.userPassword,
        confirmPassword: result.userPassword,
      });
    };
    fetchUser();
  }, [userId]);

  const formik = useFormik({
    initialValues: {
      userName: user.userName,
      userNumber: user.userNumber,
      userPassword: user.userPassword,
      confirmPassword: user.confirmPassword,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      userName: Yup.string()
        .required("نام کاربری اجباری است")
        .matches(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, "فقط حروف انگلیسی، اعداد، حروف فارسی و فاصله بین کلمات مجاز است"),
      userNumber: Yup.string()
        .required("شماره همراه اجباری است")
        .matches(/^[0-9]+$/, "فقط اعداد مجاز است"),
      userPassword: Yup.string()
        .required("رمز عبور اجباری است")
        .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("userPassword"), null], "رمز عبور مطابقت ندارد")
        .required("تکرار رمز عبور اجباری است"),
    }),
    onSubmit: async (values) => {
      try {
        const updatedUser = {
          userName: values.userName,
          userNumber: values.userNumber,
          userPassword: values.userPassword,
        };
        await editUser(userId, updatedUser);
        navigate(`/users`, { state: { userName, isAdmin } });
      } catch (error) {
        alert("نام کاربری یا شماره همراه وارد شده قبلا ثبت شده است");
      }
    },
  });

  return (
    <>
      {false ? (
        <Spinner />
      ) : (
        <>
          <section className="p-3">
            <div className="container">
              <div className="row my-2">
                <div className="col text-center">
                  <p className="h4 fw-bold" style={{ color: ORANGE }}>
                    ویرایش مشخصات کاربر
                  </p>
                </div>
              </div>
              <hr style={{ backgroundColor: ORANGE }} />
              <div
                className="row p-2 w-75 mx-auto align-items-center"
                style={{ backgroundColor: "#44475a", borderRadius: "1em" }}
              >
                <div className="col-md">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="mb-2">
                      <input
                        name="userName"
                        type="text"
                        className="form-control"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                        placeholder="نام مشتری"
                      />
                      {formik.touched.userName && formik.errors.userName ? (
                        <div className="text-danger">
                          {formik.errors.userName}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-2">
                      <input
                        name="userNumber"
                        type="text"
                        className="form-control"
                        value={formik.values.userNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                        placeholder="شماره همراه مشتری"
                      />
                      {formik.touched.userNumber && formik.errors.userNumber ? (
                        <div className="text-danger">
                          {formik.errors.userNumber}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-2">
                      <input
                        name="userPassword"
                        type="password"
                        className="form-control"
                        value={formik.values.userPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                        placeholder="رمز"
                      />
                      {formik.touched.userPassword &&
                      formik.errors.userPassword ? (
                        <div className="text-danger">
                          {formik.errors.userPassword}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-2">
                      <input
                        name="confirmPassword"
                        type="password"
                        className="form-control"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                        placeholder="تکرار رمز"
                      />
                      {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword ? (
                        <div className="text-danger">
                          {formik.errors.confirmPassword}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-2">
                      <input
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: PURPLE }}
                        value="ویرایش"
                      />
                      <Link
                        to={`/users`}
                        state={{ userName, isAdmin }}
                        className="btn mx-2"
                        style={{ backgroundColor: COMMENT }}
                      >
                        انصراف
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="text-center mt-1">
              <img
                src={require("../../assets/man-taking-note.png")}
                height="300px"
                style={{ opacity: "60%" }}
              />
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default EditUser;
