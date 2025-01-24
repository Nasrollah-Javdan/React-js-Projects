import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode"; // Correct named import
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
  const [userInfo, setUserInfo] = useState(null); // Initialize as null
  const alertShown = useRef(false);

  const navigate = useNavigate();

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
        if(!alertShown.current){
          alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
          alertShown.current = true; 
        }
        navigate("/");
        console.error("Error decoding token:", error);
      }
    } else {
      if(!alertShown.current){
        alert("دسترسی شما غیرمجاز است، به صفحه لاگین منتقل میشوید");
        alertShown.current = true; 
      }
      navigate("/");
      console.error("No token found in cookies.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo) { // Ensure userInfo is set before making API calls
        const result = await getAllUsers();
        setData(result);
        setFilteredData(result);
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        const result = await searchUsers(searchTerm);
        setFilteredData(result);
      } else {
        setFilteredData(data);
      }
    };
    fetchSearchResults();
  }, [searchTerm, data]);

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
            <div
              className="text-center py-5"
              style={{ backgroundColor: CURRENTLINE }}
            >
              <p className="h3" style={{ color: ORANGE }}>
                کاربری یافت نشد ...
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

export default Users;
