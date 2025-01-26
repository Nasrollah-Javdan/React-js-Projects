import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { getAllUsers, searchUsers } from "../../services";
import Spinner from "../Spinner";
import Navbar from "../Navbar";
import User from "./User";
import SearchBox from "../SearchBox"; 
import { CURRENTLINE, CYAN, GREEN, ORANGE, PINK } from "../../helpers/colors";

const Users = ({ confirmDelete }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const usersPerPage = 15;
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
        console.error("Error decoding token:", error);
      }
    } else {
      if (!alertShown.current) {
        alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
        alertShown.current = true;
      }
      navigate("/");
      console.error("No token found in cookies.");
    }
  }, [navigate]);

  const fetchUsers = async () => {
    if (userInfo) {
      const result = await getAllUsers(currentPage, usersPerPage); 
      if(!result.users){
        if (!alertShown.current) {
          alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
          alertShown.current = true;
        }
        navigate("/");
      }
      setData(result.users || []);
      setFilteredData(result.users || []);
      setPageCount(Math.ceil(result.totalUsers / usersPerPage));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userInfo, currentPage]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        const result = await searchUsers(searchTerm);
        setFilteredData(result || []);
        // console.log(result);
      } else {
        setFilteredData(data);
      }
    };
    fetchSearchResults();
  }, [searchTerm, data]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
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
            ) : null}
          </div>
        </div>
      </section>
      <section className="container">
        <div className="row">
          <SearchBox onSearch={handleSearch} />
        </div>
        <div className="row">
          {filteredData.length !== 0 ? (
            filteredData.map((d, key) => (
              <User
                confirmDelete={() => confirmDelete()}
                key={key}
                id={d.userId}
                name={d.userName}
                phone={d.userNumber}
                data={data}
                setData={setData}
                isAdmin={userInfo.isAdmin}
                userName={userInfo.userName}
              />
            ))
          ) : (
            <div className="text-center py-5" style={{ backgroundColor: CURRENTLINE }}>
              <p className="h3" style={{ color: ORANGE }}>
                کاربری یافت نشد ...
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

export default Users;
