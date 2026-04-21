import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import NavBar from "./components/NavBar";
import AdminLayout from "./components/AdminLayout";


import RentalDashboard from "./pages/Admin/RentalDashboard";
import Chat from "./components/Chat";
import AdminChats from "./pages/Admin/AdminChats";

const Home = lazy(() => import("./pages/Home"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetails = lazy(() => import("./pages/ProperyDetails"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const Favorites = lazy(() => import("./pages/Favorites"));

const AddProperty = lazy(() => import("./pages/Admin/AddProperty"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const MyProperties = lazy(() => import("./pages/Admin/MyProperties"));
const EditProperty = lazy(() => import("./pages/Admin/EditProperty"));

const AdminBookings = lazy(() => import("./pages/AdminBookings"));


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};


const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "Admin" ? children : <Navigate to="/" replace />;
};




function AppContent() {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      
      {!isAdminPage && <NavBar />}

      <Suspense fallback={<h2 style={{ padding: "20px" }}>Loading...</h2>}>
        <Routes>

          {/* ROOT */}
          <Route
            path="/"
            element={
              role === "Admin"
                ? <Navigate to="/admin" replace />
                : <Home />
            }
          />

         
          <Route
            path="/login"
            element={
              localStorage.getItem("token")
                ? (role === "Admin"
                    ? <Navigate to="/admin" replace />
                    : <Navigate to="/" replace />)
                : <Login />
            }
          />

          <Route
            path="/register"
            element={
              localStorage.getItem("token")
                ? <Navigate to="/" replace />
                : <Register />
            }
          />

          
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />

          <Route
            path="/mybookings"
            element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />

       
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="add" element={<AddProperty />} />
            <Route path="properties" element={<MyProperties />} />
            <Route path="edit/:id" element={<EditProperty />} />

            <Route path="rentals" element={<RentalDashboard />} />
            <Route path="chats" element={<AdminChats />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>

          <Route
            path="/chat/:id"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />

         
          <Route path="/add-property" element={<Navigate to="/" replace />} />

          
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </>
  );
}




function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;