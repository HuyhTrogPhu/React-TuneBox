import React, { useState } from "react";
import { images } from "../../assets/images/images";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);

  // Hàm mở và đóng modal
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Hàm submit track (tạm thời console log, bạn có thể gắn với API của mình)
  const handleSubmitTrack = (event) => {
    event.preventDefault();
    const trackData = new FormData(event.target);
    // Xử lý dữ liệu track ở đây (ví dụ như gửi lên API)
    console.log("Track Data:", trackData.get('title'), trackData.get('file'));
    handleClose();
  };

  return (
    <>
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
        <div className="col text-end" style={{ alignItems: "center" }}>
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
            <Link to={"/profileUser"}>
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
            <Link to={"/Cart"}>
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
          {/* Dropdown Create */}
          <div className="btn-group">
            <button
              className="btn btn-danger dropdown-toggle"
              style={{
                marginBottom: "15px",
                marginRight: "10px",
              }}
              type="button"
              id="createDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
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
              <b>Create</b>
            </button>
            <ul className="dropdown-menu" aria-labelledby="createDropdown">
              <li>
                <button className="dropdown-item" onClick={handleShow}>
                  Create Track
                </button>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Create Album
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Create Playlist
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
      </header>

      {/* Modal Create Track */}
      <Modal show={showModal} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Create Track</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleSubmitTrack}>
      <Form.Group controlId="trackTitle">
        <Form.Label>Track Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          placeholder="Enter track title"
          required
        />
      </Form.Group>

      <Form.Group controlId="trackFile">
        <Form.Label>Track File</Form.Label>
        <Form.Control type="file" name="file" accept="audio/*" required />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        style={{ marginTop: "10px" }}
      >
        Submit
      </Button>
    </Form>
  </Modal.Body>
</Modal>

    </>
  );
};

export default Navbar;
