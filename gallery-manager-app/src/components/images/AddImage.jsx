
import { Link, useNavigate, useParams } from "react-router-dom";


import { Spinner } from "..";
import { COMMENT, GREEN, PURPLE } from "../../helpers/colors";

const AddImage = () => {

    

    const { userName } = useParams();

    const navigate = useNavigate();

    const createImage = (e) => {
      e.preventDefault();
      navigate(`/images/${userName}`);
    }

  return (
    <>
      {false ? (
        <Spinner />
      ) : (
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
                  <p
                    className="h4 fw-bold text-center"
                    style={{ color: GREEN }}
                  >
                    بارگزاری عکس جدید
                  </p>
                </div>
              </div>
              <hr style={{ backgroundColor: GREEN }} />
              <div className="row mt-5">
                <div className="col-md-4">
                  <form onSubmit={createImage}>
                    <div className="mb-2">
                      <input
                        name="photo"
                        type="file"
                        
                        className="form-control"
                        // required={true}
                        placeholder="آدرس تصویر"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="fullname"
                        type="text"
                        
                        className="form-control"
                        placeholder="شناسه عکس"
                        required={true}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="mobile"
                        type="text"
                        
                        className="form-control"
                        required={true}
                        placeholder="شناسه مشتری"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        name="email"
                       
                        className="form-control"
                        required={true}
                        placeholder="نام مشتری"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        name="job"
                       
                        className="form-control"
                        required={true}
                        placeholder="شماره همراه مشتری"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        name="job"
                        
                        className="form-control"
                        required={true}
                        placeholder="نام عکاس"
                      />
                    </div>
                    <div className="mb-2">
                      <textarea
                        type="text"
                        name="job"
                       
                        className="form-control"
                        required={true}
                        placeholder="توضیحات"
                      />
                    </div>
                    
                    <div className="mx-2">
                      <input
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: PURPLE }}
                        value="بارگزاری"
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
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default AddImage;
