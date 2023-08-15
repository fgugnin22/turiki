import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ResetPassword from "../pages/ResetPassword";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";
import Activate from "../pages/Activate";
import { Provider } from "react-redux";
import { store } from "../rtk/store";
import Team from "../pages/Team";
import Match from "../pages/Match";
import Tournament from "../pages/Tournament";
import TournamentRegisterTeam from "../pages/TournamentRegisterTeam";
import NoMatch from "../pages/NoMatch";
import TeamCreate from "../pages/TeamCreate";
import TeamList from "../pages/TeamList";
import TournmanetList from "../pages/TournamentList";
import { ROUTES } from "./RouteTypes";
import AdminBoard from "../pages/AdminBoard";
import BracketExample from "../shared/BracketExample";
// import Test from "./pages/Test";
function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path={ROUTES.ADMINPAGE.path}
                        element={<AdminBoard />}
                    ></Route>
                    <Route
                        path={ROUTES.DASHBOARD.path}
                        element={<Home />}
                    ></Route>
                    <Route path={ROUTES.LOGIN.path} element={<Login />}></Route>
                    <Route
                        path={ROUTES.REGISTER_ACCOUNT.path}
                        element={<Signup />}
                    ></Route>
                    <Route
                        path={ROUTES.RESET_PASSWORD.path}
                        element={<ResetPassword />}
                    ></Route>
                    <Route
                        path={ROUTES.RESET_PASSWORD_CONFIRM.path}
                        element={<ResetPasswordConfirm />}
                    ></Route>
                    <Route
                        path={ROUTES.ACTIVATE_ACCOUNT.path}
                        element={<Activate />}
                    ></Route>
                    <Route
                        path={ROUTES.TEAMS.TEAM_BY_ID.path}
                        element={<Team />}
                    ></Route>
                    <Route
                        path={ROUTES.MATCHES.MATCH_BY_ID.path}
                        element={<Match />}
                    ></Route>
                    <Route
                        path={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.path}
                        element={<Tournament />}
                    ></Route>
                    <Route
                        path={
                            ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.REGISTER_TEAM
                                .path
                        }
                        element={<TournamentRegisterTeam />}
                    ></Route>
                    <Route
                        path={ROUTES.NO_MATCH404.path}
                        element={<NoMatch />}
                    />
                    <Route
                        path={ROUTES.TEAMS.CREATE.path}
                        element={<TeamCreate />}
                    ></Route>
                    <Route
                        path={ROUTES.TEAMS.path}
                        element={<TeamList />}
                    ></Route>
                    <Route
                        path={ROUTES.TOURNAMENTS.path}
                        element={<TournmanetList />}
                    ></Route>
                    <Route
                        path="/examples/:name"
                        element={<BracketExample />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
