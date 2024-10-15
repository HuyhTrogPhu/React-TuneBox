import React, { useState } from "react";
import { images } from "../../assets/images/images";
import "./Navbar.css";
import { Link } from "react-router-dom";


const Navbar = () => {

  const [user, setUser] = useState('');

  const userId = Cookies.get('userId');
  

  return (
    <header
      className="row"
      style={{
        alignItems: "center",
      }}
    >
      <div
        className="col"
        style={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <button className="btn">
          <Link to={"/"}>
            <img
              alt="tunebox"
              src={images.logoTuneBox}
              style={{
                marginLeft: "50px",
                marginRight: "50px",
              }}
              width="150"
            />
          </Link>
        </button>
        {/* Trang feed */}
        <button className="btn">
          <Link className="text-decoration-none text-black" to={"/"}>
            <span
              className="text-decoration-none"
              style={{
                marginRight: "30px",
              }}
            >
              <img
                alt="icon-home"
                src={images.home}
                style={{
                  marginBottom: "15px",
                  marginRight: "15px",
                }}
              />
              <b>Feed</b>
            </span>
          </Link>
        </button>
        {/* Trang giỏ hàng */}
        <button className="btn">
          <Link
            className="text-decoration-none text-black"
            to={"/HomeEcommerce"}
          >
            <span>
              <img
                alt="icon-loa"
                src={images.speaker}
                style={{
                  marginBottom: "15px",
                  marginRight: "15px",
                }}
                width="35px"
              />
              <b>Shops</b>
            </span>
          </Link>
        </button>
      </div>
      <div className="col text-end" style={{ alignItems: "center", }}>
        <span>
          <img
            alt="icon-chuong"
            src={images.notification}
            style={{
              marginBottom: "15px",
              marginRight: "30px",
            }}
          />
        </span>
        <span>
          <img
            alt="icon-chat"
            src={images.conversstion}
            style={{
              marginBottom: "15px",
              marginRight: "30px",
            }}
          />
        </span>
        {/* Trang get Prime */}
        <button
          className="btn btn-warning "
          style={{
            marginBottom: "15px",
            marginRight: "20px",
          }}
          type="button"
        >
          <span>
            <b>Get</b>
          </span>{" "}
          <img
            alt="icon-crow"
            height="32px"
            src={images.crown}
            style={{
              marginLeft: "10px",
            }}
            width="32px"
          />
        </button>
        {/* Trang cá nhân */}
        <button className="btn">
          <Link to={'/profileUser'}>
            <img
              alt="Avatar"
              className="avatar_small"
              src={images.avt}
              style={{
                height: "50px",
                marginBottom: "15px",
                width: "50px",
                borderRadius: "50%",
              }}
            />
          </Link>
        </button>
        {/* Trang giỏ hàng */}
        <button className="btn">
          <Link to={'/Cart'}>
            <span>
              <img
                alt="icon-giohang"
                src={images.shopping_bag}
                style={{
                  marginBottom: "15px",
                  marginRight: "30px",
                }}
              />
            </span>
          </Link>
        </button>
        {/* Trang tạo track */}
        <button
          className="btn btn-danger"
          style={{
            marginBottom: "15px",
            marginRight: "10px",
          }}
          type="button"
        >
          {" "}
          <img
            alt="icon-plus"
            height="20px"
            src={images.plus_white}
            style={{
              marginBottom: "3px",
              marginRight: "10px",
            }}
            width="20px"
          />{" "}
          <b>Create</b>{" "}
        </button>
      </div>
      <hr />
    </header>
  );
};

export default Navbar;
