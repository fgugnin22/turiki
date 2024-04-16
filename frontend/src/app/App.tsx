import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ResetPassword from "../pages/ResetPassword";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";
import Activate from "../pages/Activate";
import { Provider } from "react-redux";
import { store } from "../shared/rtk/store";
import Team from "../pages/Team";
import Match from "../pages/Match";
import Tournament from "../pages/Tournament";
import NoMatch from "../pages/NoMatch";
import TeamCreateOrFind from "../pages/TeamCreateOrFind";
import TournmanetList from "../pages/TournamentList";
import { ROUTES } from "../shared/RouteTypes";
import AdminBoard from "../pages/AdminBoard";
import Test from "../pages/Test";
import AccountPage from "../pages/AccountPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* По хорошему надо сделать админку отдельной страницой */}
          <Route
            path={ROUTES.ADMINPAGE.path}
            element={<AdminBoard />} // этого пока нет
          ></Route>
          <Route
            path={ROUTES.LANDING.path}
            element={<Home />} // это лендинг( там где надпись наш первый турнир)
          ></Route>
          <Route
            path={ROUTES.DASHBOARD.path}
            element={<AccountPage />} // это лендинг( там где надпись наш первый турнир)
          ></Route>
          <Route path={ROUTES.LOGIN.path} element={<Login />}></Route>
          <Route
            path={ROUTES.REGISTER_ACCOUNT.path}
            element={<Signup />} // страница реги, только что была
          ></Route>
          <Route
            path={ROUTES.RESET_PASSWORD.path}
            element={<ResetPassword />} // страница сброса пароля, где я указывал почту
          ></Route>
          <Route
            path={ROUTES.RESET_PASSWORD_CONFIRM.path}
            element={<ResetPasswordConfirm />} // страница сброса пароля, где я уже указывал и подтверждал новый пароль
          ></Route>
          <Route
            path={ROUTES.ACTIVATE_ACCOUNT.path}
            element={<Activate />} // страница активации почты/аккаунта, уже была
          ></Route>
          <Route
            path={ROUTES.TEAMS.TEAM_BY_ID.path}
            element={<Team />} // страница команды, тоже недоработанная, но это была она
          ></Route>
          <Route
            path={ROUTES.MATCHES.MATCH_BY_ID.path}
            element={<Match />} // пока пропущу
          ></Route>
          <Route
            path={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.path + "/*"}
            element={<Tournament />} // страница турнира
          ></Route>
          <Route
            path={ROUTES.TEAMS.CREATE.path}
            element={<TeamCreateOrFind />}
          ></Route>
          <Route
            path={ROUTES.TOURNAMENTS.path}
            element={<TournmanetList />}
          ></Route>
          <Route path={"/test"} element={<Test />}></Route>
          <Route path={ROUTES.NO_MATCH404.path} element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
