import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode";
import { getAllImages, getUserImages, searchImages, deleteImage } from "../../services";
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
  const [userInfo, setUserInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const imagesPerPage = 10;
  const alertShown = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo({
          isAdmin: decodedToken.role === "admin" ? 1 : 0,
          userName: decodedToken.userName,
        });
      } catch (error) {
        if (!alertShown.current) {
          alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
          alertShown.current = true;
        }
        navigate("/");
        console.error("Error decoding token");
      }
    } else {
      if (!alertShown.current) {
        alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
        alertShown.current = true;
      }
      navigate("/");
      console.error("No token found in cookies.");
    }
  }, []);

  const fetchImages = async () => {
    if (userInfo) {
      let result;
      if (userInfo.isAdmin) {
        result = await getAllImages(currentPage, imagesPerPage); 
      } else {
        result = await getUserImages(userInfo.userName, currentPage, imagesPerPage); 
      }
      if(!result.images){
        if (!alertShown.current) {
          alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
          alertShown.current = true;
        }
        navigate("/");
      }
      setImages(result.images || []); 
      setPageCount(Math.ceil(result.totalImages / imagesPerPage));
      setFilteredImages(result.images || []);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [userInfo, currentPage]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        const result = await searchImages(searchTerm);
        // console.log(result);
        setFilteredImages(result || []); // Ensure result is an array
      } else {
        setFilteredImages(images);
      }
    };
    fetchSearchResults();
  }, [searchTerm, images]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  const handleDelete = async (imageId) => {
    try {
      await deleteImage(imageId);
      fetchImages(); // Refetch images after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
    }
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
                  <Link to={`/images/add`} className="btn m-2" style={{ backgroundColor: PINK }}>
                    بارگزاری عکس
                    <i className="fa fa-plus-circle mx-2" />
                  </Link>
                </p>
                <p className="h3 float-end">
                  <Link to={`/users/add`} className="btn m-2" style={{ backgroundColor: GREEN }}>
                    ایجاد کاربر
                    <i className="fas fa-user-plus mx-2" />
                  </Link>
                </p>
                <p className="h3 float-end">
                  <Link to={`/images`} className="btn m-2" style={{ backgroundColor: CYAN }}>
                    مشاهده تصاویر
                    <i className="fas fa-user-edit mx-2" />
                  </Link>
                </p>
                <p className="h3 float-end">
                  <Link to={`/users`} className="btn m-2" style={{ backgroundColor: ORANGE }}>
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
                handleDelete={() => handleDelete(i.imageId)} // Pass the delete handler
                setImages={setImages}
              />
            ))
          ) : (
            <div className="text-center py-5" style={{ backgroundColor: CURRENTLINE }}>
              <p className="h3" style={{ color: ORANGE }}>
                عکسی یافت نشد ...
              </p>
              <img src={require("../../assets/no-found.gif")} alt="پیدا نشد" className="w-25" />
            </div>
          )}
        </div>
        <div className="row d-flex justify-content-center">
          <ReactPaginate
            previousLabel={"قبلی"}
            nextLabel={"بعدی"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      </section>
    </>
  );
};

export default Images;
