import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllUsers, searchUsers } from "../../services";
import Spinner from "../Spinner";
import Navbar from "../Navbar";
import User from "./User";
import SearchBox from "../SearchBox"; 
import { CURRENTLINE, CYAN, GREEN, ORANGE, PINK } from "../../helpers/colors";

const Users = ({ confirmDelete }) => {
  const { state } = useLocation();
  const { isAdmin, userName } = state;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllUsers();
      setData(result);
      setFilteredData(result);
      setLoading(false);
    };
    fetchData();
  }, []);

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
            ) : null}
          </div>
        </div>
      </section>
      {loading ? (
        <Spinner />
      ) : (
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
                  isAdmin={isAdmin}
                  userName={userName}
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
      )}
    </>
  );
};

export default Users;
