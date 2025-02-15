import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "..";
import { COMMENT, ORANGE, PURPLE } from "../../helpers/colors";
import { editUser, getUser } from "../../services";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import bcrypt from "bcryptjs";
import { jwtDecode } from "jwt-decode";

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location?.state?.userId;
  const userName = location?.state?.userName;
  const isAdmin = location?.state?.isAdmin;
  const [userInfo, setUserInfo] = useState(null);
  const alertShown = useRef(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo({
          isAdmin: decodedToken.role === "admin" ? 1 : 0,
          userName: decodedToken.userName,
        });
      } catch (error) {
        if (!alertShown.current) {
          alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
          alertShown.current = true;
        }
        navigate("/");
        console.error("Error decoding token:", error);
      }
    } else {
      if (!alertShown.current) {
        alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
        alertShown.current = true;
      }
      navigate("/");
      console.error("No token found in cookies.");
    }
  }, []);

  const [user, setUser] = useState({
    userName: "",
    userNumber: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUser(userId);
      if (!result.userName) {
        if (!alertShown.current) {
          alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
          alertShown.current = true;
        }
        navigate("/");
      }
      // console.log(result.userName);
      setUser({
        userName: result.userName,
        userNumber: result.userNumber,
        userEmail: result.userEmail || "", // اضافه کردن فیلد ایمیل
        userPassword: "",
        confirmPassword: "",
      });
    };
    fetchUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      userName: user.userName,
      userNumber: user.userNumber,
      userEmail: user.userEmail,
      userPassword: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      userName: Yup.string()
        .required("نام کاربری اجباری است")
        .matches(
          /^[\u0600-\u06FFa-zA-Z0-9_ ]+$/,
          "فقط حروف انگلیسی، اعداد، حروف فارسی و فاصله بین کلمات مجاز است"
        ),
      userNumber: Yup.string()
        .required("شماره همراه اجباری است")
        .matches(/^[0-9]+$/, "فقط اعداد مجاز است"),
      userEmail: Yup.string().email("ایمیل باید معتبر باشد"),
      userPassword: Yup.string().min(8, "رمز عبور باید حداقل 8 کاراکتر باشد"),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref("userPassword"), null],
        "رمز عبور مطابقت ندارد"
      ),
    }),
    onSubmit: async (values) => {
      try {
        let updatedUser = {
          userName: values.userName,
          userNumber: values.userNumber,
          userEmail: values.userEmail,
        };

        if (values.userPassword) {
          const hashedPassword = await bcrypt.hash(values.userPassword, 10);
          updatedUser.userPassword = hashedPassword;
        }

        const response = await editUser(userId, updatedUser);

        // console.log("Response from editUser:", response);

        if (
          response.message === "User and related images updated successfully"
        ) {
          alert("اطلاعات کاربر با موفقیت ویرایش شد");
          navigate(`/users`);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error(error);
        alert("نام کاربری یا شماره همراه وارد شده قبلا ثبت شده است");
      }
    },
  });

  const generatePassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    formik.setFieldValue("userPassword", password);
    formik.setFieldValue("confirmPassword", password);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return ( user.userName ? (
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
                    <div className="text-danger">{formik.errors.userName}</div>
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
                    name="userEmail" // اضافه کردن فیلد ایمیل به فرم
                    type="email"
                    className="form-control"
                    value={formik.values.userEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="ایمیل مشتری (اختیاری)"
                  />
                  {formik.touched.userEmail && formik.errors.userEmail ? (
                    <div className="text-danger">{formik.errors.userEmail}</div>
                  ) : null}
                </div>
                <div className="mb-2">
                  <div className="input-group">
                    <input
                      name="userPassword"
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      value={formik.values.userPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="رمز"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formik.touched.userPassword && formik.errors.userPassword ? (
                    <div className="text-danger">
                      {formik.errors.userPassword}
                    </div>
                  ) : null}
                </div>
                <div className="mb-2">
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="تکرار رمز"
                  />
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <div className="text-danger">
                      {formik.errors.confirmPassword}
                    </div>
                  ) : null}
                </div>
                <div className="mb-2 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={generatePassword}
                    style={{ margin: "0 auto" }}
                  >
                    تولید رمز عبور
                  </button>
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
  ) : null

)
};

export default EditUser;
