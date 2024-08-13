import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./style.navigation.css";
import categories from "../constantData/constant.js";
import { useNavigate } from "react-router-dom";
import AuthDropdown from "../dropdown/NavDropdown.jsx";
import { fetchSearchProducts, getUsername } from "../../middleware/helper.js";
import { Cog, Search, ShoppingCart, User } from "lucide-react";
import useCartStore from "../../zustand/useCartStore.js";

function Navigation() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("admin");
  const isAuthorized = localStorage.getItem("token");
  const [dropdownVisible, setDropdownVisible] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const cartCount = useCartStore((state) => state.cartCount);

  const handleSearch = useCallback(async () => {
    if (searchInput.trim() === "") return;
    try {
      const response = await fetchSearchProducts(searchInput.trim());
      if (response.status === 200) {
        const data = await response.data;
        navigate("/search-items", { state: { products: data } });
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, [searchInput, navigate]);

  useEffect(() => {
    getUsername()
      .then((data) => {
        setUsername(data.username);
        setUserRole("admin"); // Adjust based on actual response
      })
      .catch((error) => {
        console.error("Error fetching username:", error);
      });
  }, []);

  const handleCart = useCallback(() => {
    navigate(isAuthorized ? "/cart" : "/cart-login");
  }, [isAuthorized, navigate]);

  const toggleDropdown = useCallback((category) => {
    setDropdownVisible((prev) => (prev === category ? "" : category));
  }, []);

  const memoizedCategories = useMemo(() => categories, []);

  return (
    <nav className="nav-wrapper">
      <div className="nav-container">
        <div className="container-left">
          <a href="/" className="brand-logo">
            ClearEyeCare
          </a>
        </div>
        <div className="container-middle">
          <ul className="nav-link">
            {memoizedCategories.map(({ category, items }) => (
              <Dropdown
                key={category}
                category={category}
                items={items}
                visible={dropdownVisible}
                toggleDropdown={toggleDropdown}
              />
            ))}
          </ul>
        </div>
        <div className="container-right">
          <SearchComponent
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
          />
          {isAuthorized && userRole === "admin" && (
            <div className="nav-console">
              <Cog />
            </div>
          )}
          <ProfileComponent
            isAuthorized={isAuthorized}
            open={open}
            setOpen={setOpen}
            username={username}
          />
          <div className="nav-cart" onClick={handleCart}>
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="nav-cart-value">{cartCount}</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

const Dropdown = ({ category, items, visible, toggleDropdown }) => {
  const chunkedItems = useMemo(() => chunkItems(items, 10), [items]);

  return (
    <li
      className="nav-item"
      onMouseEnter={() => toggleDropdown(category)}
      onMouseLeave={() => toggleDropdown("")}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
      {visible === category && (
        <div className="dropdown-content">
          {chunkedItems.map((chunk, index) => (
            <div key={index} className="dropdown-column">
              {chunk.map((item) => (
                <a key={item} href="#">
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </li>
  );
};

const SearchComponent = ({ searchInput, setSearchInput, handleSearch }) => (
  <div className="nav-search">
    <input
      type="search"
      name="search"
      id="search"
      className="search-input"
      placeholder="search products..."
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && searchInput.trim() !== "") {
          handleSearch();
        }
      }}
    />
    <button onClick={handleSearch} className="search-label">
      <Search />
    </button>
  </div>
);

const ProfileComponent = ({ isAuthorized, open, setOpen, username }) => (
  <div className="nav-profile" onClick={() => setOpen(!open)}>
    {isAuthorized ? (
      <div className="user-auth-icon">
        {username.substring(0).toUpperCase()}
      </div>
    ) : (
      <User />
    )}
    {open && (
      <AuthDropdown
        isAuthorized={isAuthorized}
        onClose={() => setOpen(false)}
      />
    )}
  </div>
);



const chunkItems = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};
