import { useEffect, useState, useContext } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { Spinner } from "..";
import { COMMENT, ORANGE, PURPLE } from "../../helpers/colors";

const EditImage = () => {
  const { imageId, userName } = useParams();

  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();
    navigate(`/images/${userName}`);
  };

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
                    ویرایش مشخصات عکس
                  </p>
                </div>
              </div>
              <hr style={{ backgroundColor: ORANGE }} />
              <div
                className="row p-2 w-75 mx-auto align-items-center"
                style={{ backgroundColor: "#44475a", borderRadius: "1em" }}
              >
                <div className="col-md-8">
                  <form onSubmit={submitForm}>
                    <div className="mb-2">
                      <input
                        name="fullname"
                        type="text"
                        className="form-control"
                        value="1024"
                        required={true}
                        placeholder="شناسه عکس"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="photo"
                        type="file"
                        value=""
                        className="form-control"
                        // required={true}
                        placeholder="آدرس تصویر"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="mobile"
                        type="number"
                        className="form-control"
                        value="532"
                        required={true}
                        placeholder="شناسه مشتری"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="email"
                        type="text"
                        className="form-control"
                        value="حامد جباری"
                        required={true}
                        placeholder="نام مشتری"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="job"
                        type="text"
                        className="form-control"
                        value="0923112425"
                        required={true}
                        placeholder="شماره همراه مشتری"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="job"
                        type="text"
                        className="form-control"
                        value="نصراله جاودان"
                        required={true}
                        placeholder="نام عکاس"
                      />
                    </div>
                    <div className="mb-2">
                      <textarea
                        name="job"
                        type="text"
                        className="form-control"
                        value="عکس پرتره"
                        required={true}
                        placeholder="توضیحات"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: PURPLE }}
                        value="ویرایش"
                      />
                      <Link
                        to={`/images/${userName}`}
                        className="btn mx-2"
                        style={{ backgroundColor: COMMENT }}
                      >
                        انصراف
                      </Link>
                    </div>
                  </form>
                </div>
                <div className="col-md-4">
                  <img
                    src={require("../../assets/image1.png")}
                    className="img-fluid rounded"
                    style={{ border: `1px solid ${PURPLE}` }}
                  />
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

export default EditImage;
