import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { ItemProvider } from "../Items/UpdateItem/ItemContext";
import { RepairingItemProvider } from "../FRU/RepairingContext/RepairingContext";

function Dashboard() {
  return (
    <>
     
      <ItemProvider>
        <RepairingItemProvider>
          <div className="mainPage">
            <Header />
            <div className="Dashboard-content">
              <Sidebar />
              <div className="content">
                <Outlet />
              </div>
            </div>
            <Footer />
          </div>
        </RepairingItemProvider>
      </ItemProvider>
    </>
  );
}

export default Dashboard;