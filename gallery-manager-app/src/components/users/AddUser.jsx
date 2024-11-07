import { Link, useLocation, useNavigate } from "react-router-dom";
import { COMMENT, GREEN, PURPLE } from "../../helpers/colors";
import { addUser } from "../../services";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddUser = () => {
  const location = useLocation();
  const { userName, isAdmin } = location.state;
  const navigate = useNavigate();


  const validationSchema = Yup.object({
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
      .oneOf([Yup.ref('userPassword'), null], "رمز عبور مطابقت ندارد")
      .required("تکرار رمز عبور اجباری است"),
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      userNumber: '',
      userPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newUser = {
          userName: values.userName,
          userNumber: values.userNumber,
          userPassword: values.userPassword,
        };
        const addedUser = await addUser(newUser);
        alert(`    کاربر جدید با شناسه " ${addedUser.userId} " با موفقیت ایجاد شد`);
        navigate(`/users`, { state: { userName, isAdmin } });
      } catch (error) {
        alert('نام کاربری یا شماره همراه وارد شده قبلا ثبت شده است');
      }
    },
  });

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
              <form onSubmit={formik.handleSubmit}>
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
                  />
                  {formik.touched.userNumber && formik.errors.userNumber ? (
                    <div className="text-danger">{formik.errors.userNumber}</div>
                  ) : null}
                </div>
                <div className="mb-2">
                  <input
                    name="userPassword"
                    type="password"
                    className="form-control"
                    required={true}
                    placeholder="رمز عبور"
                    value={formik.values.userPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.userPassword && formik.errors.userPassword ? (
                    <div className="text-danger">{formik.errors.userPassword}</div>
                  ) : null}
                </div>
                <div className="mb-2">
                  <input
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    required={true}
                    placeholder="تکرار رمز"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                    <div className="text-danger">{formik.errors.confirmPassword}</div>
                  ) : null}
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
