import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { GREEN, RED } from "../helpers/colors";

const LoginPage = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    userId: Yup.string()
      .required("شناسه مشتری اجباری است")
      .matches(/^[0-9]+$/, "فقط اعداد مجاز است"),
    password: Yup.string()
      .required("رمز عبور اجباری است")
      .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد"),
  });

  const formik = useFormik({
    initialValues: {
      userId: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:8081/login", values);
        if (response.data.authenticated) {
          // ذخیره توکن به عنوان کوکی
          document.cookie = `token=${response.data.token};path=/`; // Remove HttpOnly
          navigate("/images");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("شناسه مشتری یا رمز عبور اشتباه است. لطفا مقادیر صحیح را وارد نمایید.");
        } else {
          alert("مشکلی پیش آمده است. لطفا با پشتیبانی تماس بگیرید.");
        }
      }
    },
  });
  

  return (
    <form className="container w-25 mt-5 p-5 rounded list-group-item-dark" onSubmit={formik.handleSubmit}>
      <div className="mb-3">
        <label htmlFor="userId" className="form-label fw-bold">
          شناسه مشتری
        </label>
        <input
          name="userId"
          type="text"
          className="form-control"
          id="userId"
          aria-describedby="userIdHelp"
          value={formik.values.userId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.userId && formik.errors.userId ? (
          <div className="text-danger">{formik.errors.userId}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <label htmlFor="userPass" className="form-label fw-bold">
          رمز
        </label>
        <input
          name="password"
          type="password"
          className="form-control"
          id="userPass"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="text-danger">{formik.errors.password}</div>
        ) : null}
      </div>
      <Link to={`/forgetPass`} className="btn fw-bold mx-2" style={{ backgroundColor: RED }}>
        فراموشی رمز <i className="fas fa-unlock-alt"></i>
      </Link>
      <button type="submit" className="btn fw-bold" style={{ backgroundColor: GREEN }}>
        ورود <i className="fas fa-sign-in-alt"></i>
      </button>
    </form>
  );
};

export default LoginPage;
