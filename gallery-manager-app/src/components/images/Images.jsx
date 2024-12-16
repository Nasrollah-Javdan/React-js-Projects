import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import { getAllImages, getUserImages, searchImages } from "../../services";
import Image from "../images/Image";
import Spinner from "../Spinner";
import { CURRENTLINE, CYAN, GREEN, ORANGE, PINK } from "../../helpers/colors";
import Navbar from "../Navbar";
import SearchBox from "../SearchBox";

const Images = ({ confirmDelete, confirmDownload }) => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userInfo, setUserInfo] = useState(null); // Initialize as null

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Correct named import usage
        setUserInfo({
          isAdmin: decodedToken.role === "admin" ? 1 : 0, // Ensure boolean
          userName: decodedToken.userName
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found in cookies.");
    }
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      if (userInfo) { // Ensure userInfo is set before making API calls
        let result;
        // console.log(userInfo.isAdmin);
        if (userInfo.isAdmin) {
          result = await getAllImages();
        } else {
          
          result = await getUserImages(userInfo.userName);
        }
        setImages(result);
        setFilteredImages(result);
        setLoading(false);
        // console.log("Images fetched:", result);
      }
    };

    fetchImages();
  }, [userInfo]);

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

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar userName={userInfo?.userName} />
      <section className="container">
        <div className="grid">
          <div className="row">
            {userInfo?.isAdmin ? (
              <div className="col mt-2">
                <p className="h3 float-end">
                  <Link
                    to={`/images/add`}
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
                    className="btn m-2"
                    style={{ backgroundColor: GREEN }}
                  >
                    ایجاد کاربر
                    <i className="fas fa-user-plus mx-2" />
                  </Link>
                </p>

                <p className="h3 float-end">
                  <Link
                    to={`/images`}
                    className="btn m-2"
                    style={{ backgroundColor: CYAN }}
                  >
                    مشاهده تصاویر
                    <i className="fas fa-user-edit mx-2" />
                  </Link>
                </p>
                <p className="h3 float-end">
                  <Link
                    to={`/users`}
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
                userPhone={i.userNumber}
                photographerName={i.photographerName}
                description={i.description}
                confirmDelete={confirmDelete}
                confirmDownload={confirmDownload}
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
    </>
  );
};

export default Images;
