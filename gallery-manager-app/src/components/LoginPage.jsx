import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GREEN, RED } from '../helpers/colors';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('نام کاربری اجباری است')
      .matches(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, "فقط حروف انگلیسی، اعداد، حروف فارسی و فاصله بین کلمات مجاز است"),
    password: Yup.string()
      .required('رمز عبور اجباری است')
      .min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:8081/login', values);
        if (response.data.authenticated) {
          navigate('/images', {state : {isAdmin: response.data.isAdmin, userName: response.data.userName}});
        } else {
          alert('نام کاربری یا رمز عبور اشتباه است . لطفا مقادیر صحیح را وارد نمایید');
        }
      } catch (error) {
        alert('مشکلی پیش آمده است . لطفا با پشتیبانی تماس بگیرید');
      }
    },
  });

  return (
    <>
    <form className="container w-25 mt-5 p-5 rounded list-group-item-dark" onSubmit={formik.handleSubmit}>
      <div className="mb-3">
        <label htmlFor="userName" className="form-label fw-bold">نام کاربری</label>
        <input
          name="name"
          type="text"
          className="form-control"
          id="userName"
          aria-describedby="userNameHelp"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-danger">{formik.errors.name}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <label htmlFor="userPass" className="form-label fw-bold">رمز</label>
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
      <button type="" className="btn fw-bold mx-2" style={{ backgroundColor: RED }}>
        فراموشی رمز 
      </button>
      <button type="submit" className="btn fw-bold" style={{ backgroundColor: GREEN }}>
        ورود <i className="fas fa-sign-in-alt"></i>
      </button>
    </form>
    </>
  );
};

export default LoginPage;
