import "./Navbar.css";

const Navbar = () => {
  //返回前一頁處理
  const handleBack = () => {
    window.history.back();
  };

  //返回主畫面處理
  const handleHome = () => {
    window.location.href = "/";
  };
  return (
    <>
      <div className="back-container">
        <button className="back-btn" onClick={handleBack}>
          &lt;Back
        </button>
      </div>
      <div className="navbar-container">
        <button className="home-btn" onClick={handleHome}>
          <img src="/assets/home.png" alt="主畫面" className="home-icon" />
        </button>
      </div>
    </>
  );
};
export default Navbar;
