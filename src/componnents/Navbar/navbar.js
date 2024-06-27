import { Link } from "react-router-dom";
import {
  HiUserCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import { CgMenuGridR } from "react-icons/cg";
import { FiHeart } from "react-icons/fi";
import "./navbar.scss";

// Redux import
import { userLogin } from "../../Redux/Actions/userActions";
import { userLogout } from "../../Redux/Actions/userActions";

// Hooks
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";

function Navbar(props) {
  // State
  const [isWindowDown, setWindowDown] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  // API & USE CONSTANTE
  const dispatch = useDispatch();
  const location = useLocation();
  const isLogin = useSelector((state) => state.userLogin.isLogin);

  // EFFECTS 1
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (currentScrollPos > prevScrollPos) {
        setWindowDown(true);
      } else {
        setWindowDown(false);
      }
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  // FUNCTIONS
  const handleLogout = async () => {
    await dispatch(userLogout());
  };

  return (
    <>
      <div className={prevScrollPos <= 10 ? "login" : "scroll"}>
        <div className="container">
          <div className="logo-container">
            <h1>Yourtube</h1>
          </div>
          <div className="login-container">
            <Link
              className={`connexion ${
                location.pathname === "/" ? "activeLink" : ""
              }`}
              to={"/"}
            >
              Home
            </Link>
            {isLogin && isLogin ? (
              <Link
                onClick={handleLogout}
                className={`connexion ${
                  location.pathname === "/login" ? "activeLink" : ""
                }`}
                to={"/login"}
              >
                Logout
              </Link>
            ) : (
              <>
                <Link
                  className={`connexion ${
                    location.pathname === "/login" ? "activeLink" : ""
                  }`}
                  to={"/login"}
                >
                  Login
                </Link>
                <Link
                  className={`connexion ${
                    location.pathname === "/register" ? "activeLink" : ""
                  }`}
                  to={"/register"}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
