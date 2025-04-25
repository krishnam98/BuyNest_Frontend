import Home from "./Home";
import SellerPanel from "./SellerPanel";

const RoleBasedComp = () => {
  const role = localStorage.getItem("role");
  return <>{role === "SELLER" ? <SellerPanel /> : <Home />}</>;
};
export default RoleBasedComp;
