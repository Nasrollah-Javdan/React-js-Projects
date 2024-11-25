import { Link, useLocation, useNavigate } from "react-router-dom";
import { COMMENT, GREEN, PURPLE } from "../../helpers/colors";
import { addUser, getLastUserId } from "../../services";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // آیکون‌های چشم باز و بسته
import bcrypt from 'bcryptjs'; // کتابخانه برای هش کردن رمز عبور

const AddUser = () => {
  const location = useLocation();
  const { userName, isAdmin } = location.state;
  const [lastUser, setLastUser] = useState(null); // استفاده از مقدار اولیه null
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLastUser = async () => {
      try {
        const data = await getLastUserId();
        setLastUser(data[0]); // فرض کنیم data یک آرایه است و عنصر اول را تنظیم می‌کند
      } catch (error) {
        console.error("Error fetching last user:", error);
      }
    };
    fetchLastUser();
  }, []);

  const validationSchema = Yup.object({
    userName: Yup.string()
      .required("نام کاربری اجباری است")
      .matches(
        /^[\u0600-\u06FFa-zA-Z0-9_ ]+$/,
        "فقط حروف انگلیسی، اعداد، حروف فارسی و فاصله بین کلمات مجاز است"
      ),
    userNumber: Yup.string()
      .required("شماره همراه اجباری است")
      .matches(/^[0-9]+$/, "فقط اعداد مجاز است"),
    userPassword: Yup.string()
      .required("رمز عبور اجباری است")
      .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("userPassword"), null], "رمز عبور مطابقت ندارد")
      .required("تکرار رمز عبور اجباری است"),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      userNumber: "",
      userPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const hashedPassword = await bcrypt.hash(values.userPassword, 10); // هش کردن رمز عبور
        const newUser = {
          userName: values.userName,
          userNumber: values.userNumber,
          userPassword: hashedPassword,
        };
        const addedUser = await addUser(newUser);
        alert(
          `کاربر جدید با شناسه "${addedUser.userId}" با موفقیت ایجاد شد`
        );
        navigate(`/users`, { state: { userName, isAdmin } });
      } catch (error) {
        alert("نام کاربری یا شماره همراه وارد شده قبلا ثبت شده است");
      }
    },
  });

  const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    formik.setFieldValue('userPassword', password);
    formik.setFieldValue('confirmPassword', password);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <section className="p-3">
        <img
          src={require("../../assets/man-taking-note.png")}
          height="400px"
          style={{
            position: "absolute",
            zIndex: "-1",
            top: "130px",
            left: "100px",
            opacity: "50%",
          }}
        />
        <div className="container">
          <div className="row">
            <div className="col">
              <p className="h4 fw-bold text-center" style={{ color: GREEN }}>
                ایجاد کاربر جدید
              </p>
            </div>
          </div>
          <hr style={{ backgroundColor: GREEN }} />
          <div className="row mt-5">
            <div className="col-md-4">
              <form onSubmit={formik.handleSubmit} autoComplete="off">
                <div className="mb-2">
                  <input
                    name="userId"
                    type="text"
                    className="form-control"
                    placeholder="شناسه آخرین کاربر"
                    value={lastUser ? lastUser.userId + 1 : ""}
                    disabled
                    autoComplete="off"
                  />
                </div>
                <div className="mb-2">
                  <input
                    name="userName"
                    type="text"
                    className="form-control"
                    required={true}
                    placeholder="نام مشتری"
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
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
                    required={true}
                    placeholder="شماره همراه مشتری"
                    value={formik.values.userNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                  />
                  {formik.touched.userNumber && formik.errors.userNumber ? (
                    <div className="text-danger">
                      {formik.errors.userNumber}
                    </div>
                  ) : null}
                </div>
                <div className="mb-2">
                  <div className="input-group">
                    <input
                      name="userPassword"
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      required={true}
                      placeholder="رمز عبور"
                      value={formik.values.userPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="new-password"
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
                    required={true}
                    placeholder="تکرار رمز"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="new-password"
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
                    style={{margin: "0 auto"}}
                  >
                    تولید رمز عبور
                  </button>
                </div>
                <div className="mx-2">
                  <input
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: PURPLE }}
                    value="ایجاد"
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
      </section>
    </>
  );
};

export default AddUser;
