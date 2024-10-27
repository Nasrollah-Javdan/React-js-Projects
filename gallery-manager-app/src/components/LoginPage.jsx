import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GREEN } from '../helpers/colors';
import axios from 'axios';
import Navbar from './Navbar';

const LoginPage = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('نام کاربری اجباری است')
      .matches(/^[a-zA-Z0-9_]+$/, 'فقط حروف انگلیسی و اعداد مجاز است'),
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
          alert('کاربر غیر مجاز');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('خطا در ورود به سیستم');
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
      <button type="submit" className="btn fw-bold" style={{ backgroundColor: GREEN }}>
        ورود <i className="fas fa-sign-in-alt"></i>
      </button>
    </form>
    </>
  );
};

export default LoginPage;
