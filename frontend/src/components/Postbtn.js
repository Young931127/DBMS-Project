import { useNavigate } from "react-router-dom";
import "./Button.css";

const Postbtn = () => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate("/PostPage");
  };

  return (
    <button className="post-btn" onClick={handlePostClick}>
      <i class="bi bi-file-earmark-plus" style={{ marginRight: "5px" }}></i>
      發布任務
    </button>
  );
};

export default Postbtn;
