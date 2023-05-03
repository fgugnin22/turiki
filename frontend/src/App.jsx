import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import Activate from "./pages/Activate";
import { Provider } from "react-redux";
import { store } from "./rtk/store";
import Team from "./pages/Team";
import Match from "./pages/Match"
import Tournament from "./pages/Tournament";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/reset-password" element={<ResetPassword />}></Route>
          <Route
            path="/password/reset/confirm/:uid/:token"
            element={<ResetPasswordConfirm />}
          ></Route>
          <Route path="/activate/:uid/:token" element={<Activate />}></Route>
          <Route path="/team/:id" element={<Team />}></Route>
          <Route path="/match/:id" element={<Match />}></Route>
          <Route path="/tournament/:id" element={<Tournament />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
