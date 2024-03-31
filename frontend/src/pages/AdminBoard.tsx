import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { useAppSelector } from "../shared/rtk/store";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";
import React, { useState } from "react";
import ButtonMain from "../shared/ButtonMain";
import { Team } from "../helpers/transformMatches";
import {
  possible_statuses,
  useTournamentStatus
} from "../hooks/useTournamentStatus";
import RegisterTeamModal from "../features/RegisterTeamModal";
// name
// prize
// max_rounds
// reg_starts
// time_to_check_in
// time_to_enter_lobby
// time_results_locked
// time_to_confirm_results
// time_to_select_map
// starts
const serverURL = import.meta.env.VITE_API_URL;
const AdminBoard = () => {
  const [status, setStatus] = useState({
    id: -1,
    status: ""
  });
  const [createBracket] = tournamentAPI.useCreateBracketMutation();
  const [initializeMatches] = tournamentAPI.useInitializeMatchesMutation();
  const [fetchTeamById] = tournamentAPI.useLazyGetTeamByIdQuery();
  const [changeStatus] = tournamentAPI.useChangeTournamentStatusMutation();
  const { data, error, isLoading } =
    tournamentAPI.useGetAllTournamentsQuery(null);
  const [teamIds, setTeamIds] = useState<any[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setTeamIds((prev) => {
      prev[Number(target.id)] = target.value === "" ? "" : Number(target.value);
      return [...prev];
    });
  };
  const handleTeamSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLInputElement;
    const data = (await fetchTeamById(teamIds[Number(target.id)])).data!;
    setTeams((prev) => {
      prev[Number(target.id)] = data;
      return [...prev];
    });
  };

  const { userDetails } = useAppSelector((state) => state.user);
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [formState, setFormState] = useState<any>({});
  const [createTournament] = tournamentAPI.useCreateTournamentMutation();
  const [tournData, setTournData] = useState("");
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setFormState((p: any) => ({ ...p, [target.name]: target.value }));
  };
  if (
    (user.userDetails && !user.userDetails?.is_staff) ||
    user.loginFail ||
    !localStorage.getItem("access")
  ) {
    navigate(ROUTES.NO_MATCH404.path, { replace: true });
  }
  const onTournamentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: any = {};
    for (let key of formData.keys()) {
      data[key] = formData.get(key);
    }
    data.starts += ":00+03:00";
    data.reg_starts += ":00+03:00";
    const res = await createTournament(data).unwrap();
    setTournData(JSON.stringify(res, null, 4));
  };
  let reg_starts = new Date();
  reg_starts.setMinutes(reg_starts.getMinutes() + 2);
  reg_starts.setHours(reg_starts.getHours() + 3);
  let starts = new Date();
  starts.setMinutes(starts.getMinutes() + 6);
  starts.setHours(starts.getHours() + 3);

  return (
    <Layout>
      <div>
        <form
          className="flex flex-col mx-auto w-[500px] gap-4 text-lightgray text-xl"
          onSubmit={onTournamentSubmit}
        >
          <h2 className="text-4xl text-center font-semibold text-lightblue">
            Создать турек
          </h2>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.name}
              onChange={onChange}
              defaultValue={"Тестовый турнир"}
              id="name"
              name="name"
              type="text"
            />
            <label htmlFor="name">name</label>
          </div>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.prize}
              onChange={onChange}
              defaultValue={100}
              id="prize"
              name="prize"
              type="number"
            />
            <label htmlFor="prize">prize</label>
          </div>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.max_rounds}
              onChange={onChange}
              defaultValue={1}
              id="max_rounds"
              name="max_rounds"
              type="number"
            />
            <label htmlFor="max_rounds">max_rounds</label>
          </div>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.reg_starts}
              onChange={onChange}
              defaultValue={reg_starts.toISOString().slice(0, -8)}
              id="reg_starts"
              name="reg_starts"
              type="datetime-local"
            />
            <label htmlFor="reg_starts">reg_starts</label>
          </div>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.time_to_check_in}
              onChange={onChange}
              defaultValue={"00:00:05"}
              placeholder={"00:00:05"}
              id="time_to_check_in"
              name="time_to_check_in"
              type="text"
            />
            <label htmlFor="time_to_check_in">time_to_check_in</label>
          </div>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.time_to_enter_lobby}
              onChange={onChange}
              defaultValue={"00:01:00"}
              placeholder={"00:01:00"}
              id="time_to_enter_lobby"
              name="time_to_enter_lobby"
              type="text"
            />
            <label htmlFor="time_to_enter_lobby">time_to_enter_lobby</label>
          </div>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.time_results_locked}
              onChange={onChange}
              defaultValue={"00:01:00"}
              placeholder={"00:01:00"}
              id="time_results_locked"
              name="time_results_locked"
              type="text"
            />
            <label htmlFor="time_results_locked">time_results_locked</label>
          </div>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.time_to_confirm_results}
              onChange={onChange}
              defaultValue={"00:01:00"}
              placeholder={"00:01:00"}
              id="time_to_confirm_results"
              name="time_to_confirm_results"
              type="text"
            />
            <label htmlFor="time_to_confirm_results">
              time_to_confirm_results
            </label>
          </div>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.time_to_select_map}
              onChange={onChange}
              defaultValue={"00:01:00"}
              placeholder={"00:01:00"}
              id="time_to_select_map"
              name="time_to_select_map"
              type="text"
            />
            <label htmlFor="time_to_select_map">time_to_select_map</label>
          </div>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.starts}
              onChange={onChange}
              defaultValue={starts.toISOString().slice(0, -8)}
              id="starts"
              name="starts"
              type="datetime-local"
            />
            <label htmlFor="starts">starts</label>
          </div>
          <div className="flex justify-between">
            <input
              className=" text-darkturquoise py-1 px-2 rounded-lg font-medium"
              required
              value={formState.max_players_in_team}
              onChange={onChange}
              defaultValue={1}
              id="max_players_in_team"
              name="max_players_in_team"
              type="number"
            />
            <label htmlFor="max_players_in_team">max_players_in_team</label>
          </div>
          <ButtonMain type="submit">Создать турнир!</ButtonMain>
        </form>
        <p className="w-96 text-xl text-lightgray mx-auto my-12 font-medium">
          {tournData}
        </p>
        {data && data?.length > 0 ? (
          <div className="mx-auto mt-12 text-lightgray relative right-[200px] w-[1500px]">
            {data.map((tourn, index) => {
              const statusString = useTournamentStatus(tourn.status);
              return (
                <div className="flex gap-x-2 text-black" key={index}>
                  <Link
                    to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.buildPath({
                      id: data[index]["id"]
                    })}
                    className={`shadow mx-auto w-full relative mb-4 hover:bg-turquoise hover:bg-opacity-30 transition h-24 bg-transparent
                                         flex text-center justify-between  items-center rounded-[10px] after:absolute 
                                         before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                                       after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                                         before:z-10 z-20 before:bg-dark before:rounded-[9px] hover:before:bg-opacity-80 hover:before:transition active:before:bg-opacity-50`}
                  >
                    <div className=" w-1/5 h-full flex items-center border-r border-lightblue z-30">
                      <p
                        data-content={tourn.name}
                        className="before:text-lg before:top-0 before:bottom-0 before:left-0 before:right-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] grow"
                      >
                        {tourn.name}
                      </p>
                    </div>
                    <p className="z-30 relative -top-[1px]">
                      <span
                        data-content="Призовой фонд: "
                        className="before:text-lg before:top-0 before:bottom-0 before:left-0 before:right-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] grow z-30 leading-6"
                      >
                        Призовой фонд:{" "}
                      </span>

                      <span
                        data-content={tourn.prize}
                        className="before:text-lg before:top-0 before:bottom-0 before:left-0 before:right-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] grow z-30 leading-6"
                      >
                        {tourn.prize}
                      </span>
                    </p>
                    <p
                      data-content={`${tourn.teams.length}/${
                        2 ** tourn.max_rounds
                      } Команд`}
                      className="before:text-lg before:top-0 before:bottom-0 before:left-0 before:right-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] z-30"
                    >
                      Команд: {tourn.teams.length}/{2 ** tourn.max_rounds}
                    </p>
                    <p
                      data-content={statusString}
                      className="before:text-lg before:top-0 before:bottom-0 before:left-0 before:right-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] z-30 min-w-[180px]"
                    >
                      {statusString}
                    </p>
                    <p
                      data-content={`Раундов: ${tourn.max_rounds}`}
                      className="before:text-lg before:top-0 before:bottom-0 before:left-0 before:right-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] z-30 min-w-[13%]"
                    >
                      Раундов: {tourn.max_rounds}
                    </p>
                    <img
                      src={`${serverURL}/media/img/forward.svg`}
                      className="z-30 mr-8 neonshadow"
                      alt=""
                    />
                  </Link>

                  {userDetails?.is_staff && (
                    <div className="flex flex-wrap min-h-full gap-1 lg:max-w-full text-white min-w-[400px]">
                      <button
                        onClick={() => createBracket(tourn.id)}
                        className=" hover:underline text-xs hover:text-blue-600 h-[35%] border border-gray-600 rounded-lg p-1 hover:bg-slate-100"
                      >
                        Create Bracket
                      </button>
                      <button
                        onClick={() => initializeMatches(tourn.id)}
                        className=" hover:underline text-xs hover:text-blue-600 h-[35%] border border-gray-600 rounded-lg p-1 hover:bg-slate-100"
                      >
                        Initialize Matches
                      </button>
                      <input
                        id={String(index)}
                        value={teamIds[index]}
                        onChange={handleChange}
                        className="h-10 w-1/4 text-xs border border-gray-600 rounded-lg p-1"
                        type="number"
                        placeholder="Id команды"
                      />
                      <button
                        id={String(index)}
                        onClick={handleTeamSubmit}
                        className=" hover:underline text-xs hover:text-blue-600 h-[35%] border border-gray-600 rounded-lg p-1 hover:bg-slate-100"
                      >
                        Найти команду
                      </button>

                      <select
                        className="h-10 w-1/4 text-base border border-gray-600 rounded-lg p-1 text-dark font-bold"
                        name="status"
                        id="status"
                        value={status.status}
                        onChange={(e) => {
                          const target = e.target as HTMLSelectElement;
                          setStatus({
                            id: tourn.id,
                            status: target.value
                          });
                        }}
                      >
                        {possible_statuses.map((status) => (
                          <option key={status + tourn.id} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={(e) => {
                          changeStatus(status);
                        }}
                        className=" hover:underline text-xs hover:text-blue-600 h-[35%] border border-gray-600 rounded-lg p-1 hover:bg-slate-100"
                      >
                        Сохранить статус
                      </button>
                      {teams[index] && (
                        <div className="mt-auto" key={teams[index].id}>
                          <RegisterTeamModal
                            isTeamNotRegistered={false}
                            tournamentStatus={tourn.status}
                            maxPlayers={tourn.max_players_in_team}
                            tournamentId={tourn.id}
                            team={teams[index]}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default AdminBoard;
