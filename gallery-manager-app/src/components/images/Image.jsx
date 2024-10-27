import { Link, useParams } from "react-router-dom";

import {
  CURRENTLINE,
  CYAN,
  GREEN,
  ORANGE,
  PURPLE,
  RED,
} from "../../helpers/colors";
import { useEffect, useState } from "react";

const Image = ({ confirmDelete, confirmDownload, isAdmin, userName }) => {

  return (
    <div className="col-md-6">
      <div style={{ backgroundColor: CURRENTLINE }} className="card">
        <div className="card-body d-flex justify-content-center">
          <div className="row align-items-center d-flex justify-content-center">
            <div className="col-md-4 col-sm-5 p-0">
              <img
                src={require("../../assets/image1.png")}
                alt=""
                style={{ border: `1px solid ${PURPLE}` }}
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-6 col-sm-6 p-0 mx-2">
              <ul className="list-group p-0">
                <li className="list-group-item list-group-item-dark">
                  شناسه عکس :{"  "}
                  <span className="fw-bold">1024</span>
                </li>

                <li className="list-group-item list-group-item-dark">
                  شناسه مشتری : {"  "}
                  <span className="fw-bold">532</span>
                </li>

                <li className="list-group-item list-group-item-dark">
                  نام و نام خانوادگی :{"  "}
                  <span className="fw-bold">حامد جباری</span>
                </li>
              </ul>
            </div>
            <div className="col-md-1 col-sm-1 d-flex flex-column align-items-center ">
              <Link
                to={`/images/2`}
                className="btn my-1"
                style={{ backgroundColor: ORANGE }}
              >
                <i className="fa fa-eye" />
              </Link>

              {isAdmin ? (
                <>
                  <Link
                    to={`/images/admin/edit/2`}
                    className="btn my-1"
                    style={{ backgroundColor: CYAN }}
                  >
                    <i className="fa fa-pen" />
                  </Link>
                  <button
                    onClick={confirmDelete}
                    className="btn my-1"
                    style={{ backgroundColor: RED }}
                  >
                    <i className="fa fa-trash" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={confirmDownload}
                    className="btn my-1"
                    style={{ backgroundColor: GREEN }}
                  >
                    <i className="fas fa-download" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Image;
