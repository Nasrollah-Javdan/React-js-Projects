import { useState, useEffect } from "react";
import { PURPLE } from "../helpers/colors";

const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timer, setTimer] = useState(null);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      onSearch(e.target.value);
    }, 1000);

    setTimer(newTimer);
  };

  const handleSearchClick = () => {
    if (timer) {
      clearTimeout(timer);
    }
    onSearch(searchTerm);
  };

  return (
    <div className="input-group mx-auto w-25 mb-2" dir="ltr">
      <span
        className="input-group-text"
        id="basic-addon1"
        style={{ backgroundColor: PURPLE, cursor: "pointer" }}
        onClick={handleSearchClick} // اضافه کردن کلیک برای جستجو
      >
        <i className="fas fa-search" />
      </span>
      <input
        dir="rtl"
        type="text"
        className="form-control"
        placeholder="جستجو ..."
        aria-label="Search"
        aria-describedby="basic-addon1"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBox;
