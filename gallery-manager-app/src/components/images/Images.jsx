import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllImages, getUserImages, searchImages } from "../../services";
import Image from "../images/Image";
import Spinner from "../Spinner";
import { CURRENTLINE, CYAN, GREEN, ORANGE, PINK } from "../../helpers/colors";
import Navbar from "../Navbar";
import SearchBox from "../SearchBox"; // مسیر درست برای وارد کردن

const Images = ({ confirmDelete, confirmDownload }) => {
  const { state } = useLocation();
  const { isAdmin, userName } = state;
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      let result;
      if (isAdmin) {
        result = await getAllImages();
      } else {
        result = await getUserImages(userName);
      }
      setImages(result);
      setFilteredImages(result);
      setLoading(false);
    };

    fetchImages();
  }, [isAdmin, userName]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        const result = await searchImages(searchTerm);
        setFilteredImages(result);
      } else {
        setFilteredImages(images);
      }
    };
    fetchSearchResults();
  }, [searchTerm, images]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  console.log(isAdmin, userName);

  return (
    <>
      <Navbar userName={userName} />
      <section className="container">
        <div className="grid">
          <div className="row">
            {isAdmin ? (
              <div className="col mt-2">
                <p className="h3 float-end">
                  <Link
                    to={`/images/add`}
                    state={{ isAdmin, userName }}
                    className="btn m-2"
                    style={{ backgroundColor: PINK }}
                  >
                    بارگزاری عکس
                    <i className="fa fa-plus-circle mx-2" />
                  </Link>
                </p>
                <p className="h3 float-end">
                  <Link
                    to={`/users/add`}
                    state={{ isAdmin, userName }}
                    className="btn m-2"
                    style={{ backgroundColor: GREEN }}
                  >
                    ایجاد کاربر
                    <i className="fas fa-user-plus mx-2" />
                  </Link>
                </p>

                <p className="h3 float-end">
                  <Link
                    to={"/images"}
                    state={{ isAdmin, userName }}
                    className="btn m-2"
                    style={{ backgroundColor: CYAN }}
                  >
                    مشاهده تصاویر
                    <i className="fas fa-user-edit mx-2" />
                  </Link>
                </p>
                <p className="h3 float-end">
                  <Link
                    to={"/users"}
                    state={{ isAdmin, userName }}
                    className="btn m-2"
                    style={{ backgroundColor: ORANGE }}
                  >
                    مشاهده کاربران
                    <i className="fas fa-users mx-2" />
                  </Link>
                </p>
              </div>
            ) : (
              <div className="my-2"></div>
            )}
          </div>
        </div>
      </section>
      {loading ? (
        <Spinner />
      ) : (
        <section className="container">
          <div className="row d-flex align-items-center">
            <SearchBox onSearch={handleSearch} />
          </div>
          <div className="row d-flex align-items-center">
            {filteredImages.length !== 0 ? (
              filteredImages.map((i, key) => (
                <Image
                  key={key}
                  imageId={i.imageId}
                  imagePath={i.imagePath}
                  userId={i.userId}
                  userName={i.userName}
                  LoggedUserName={userName}
                  userPhone={i.userNumber}
                  photographerName={i.photographerName}
                  description={i.description}
                  confirmDelete={confirmDelete}
                  confirmDownload={confirmDownload}
                  isAdmin={isAdmin}
                  setImages={setImages}
                />
              ))
            ) : (
              <div
                className="text-center py-5"
                style={{ backgroundColor: CURRENTLINE }}
              >
                <p className="h3" style={{ color: ORANGE }}>
                  عکسی یافت نشد ...
                </p>
                <img
                  src={require("../../assets/no-found.gif")}
                  alt="پیدا نشد"
                  className="w-25"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Images;
