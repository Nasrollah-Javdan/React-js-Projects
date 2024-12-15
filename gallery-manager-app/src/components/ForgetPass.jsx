import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { GREEN, RED } from "../helpers/colors";

const ForgetPass = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("ایمیل مشتری اجباری است")
      .email("لطفا یک ایمیل معتبر وارد کنید"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:8081/forget-password", values);
        alert(response.data.message);
        // alert("رمز جدید برای ایمیل شما ارسال شد");
        navigate("/");
      } catch (error) {
        if(error.response && error.response.status === 200){
            alert("رمز جدید برای ایمیل شما ارسال شد");
            navigate("/");
        }
        else if (error.response && error.response.status === 404) {
          alert("ایمیل مورد نظر یافت نشد.");
        } else {
          alert("مشکلی پیش آمده است. لطفا با پشتیبانی تماس بگیرید.");
        }
      }
    },
  });

  return (
    <form className="container w-25 mt-5 p-5 rounded list-group-item-dark" onSubmit={formik.handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-bold">
          ایمیل خود را وارد نمایید :
        </label>
        <input
          name="email"
          type="email"
          className="form-control"
          id="email"
          aria-describedby="emailHelp"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-danger">{formik.errors.email}</div>
        ) : null}
      </div>
      <button type="submit" className="btn fw-bold mb-2" style={{ backgroundColor: GREEN }}>
        بازیابی رمز <i className="fas fa-key"></i>
      </button>

      <Link to={`/login`} className="btn fw-bold mx-2" style={{ backgroundColor: RED }}>
        بازگشت به صفحه ورود <i className="fas fa-arrow-left"></i>
      </Link>
    </form>
  );
};

export default ForgetPass;
