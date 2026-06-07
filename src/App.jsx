import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <AppRoutes />

      <ToastContainer
        position="bottom-right"
        autoClose={3600}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        limit={4}
        theme="dark"
        toastClassName="salon-toast-shell"
        bodyClassName="salon-toast-body"
      />
    </>
  );
}

export default App;
