import { Match } from "../helpers/transformMatches";
import { tournamentAPI } from "./rtk/tournamentAPI";
import { useAppSelector } from "./rtk/store";
type Props = {
  match: Match;
  secondsRemaining: number;
};
const MapBans = ({ match, secondsRemaining }: Props) => {
  const { userDetails: user } = useAppSelector((state) => state.user);
  const [banMap] = tournamentAPI.useBanMapMutation();
  return (
    <>
      {match?.state === "BANS" && (
        <div className="w-72 m-auto flex flex-col">
          <span>
            Осталось {secondsRemaining >= 0 ? secondsRemaining : "..."}{" "}
            {secondsRemaining % 10 > 4 ||
            secondsRemaining % 10 === 0 ||
            secondsRemaining === 14
              ? "секунд"
              : secondsRemaining % 10 > 1
              ? "секунды"
              : "секунда"}
          </span>
          {match.bans?.maps.map((map) => {
            const handleBan = () => {
              if (!user?.team) {
                return;
              }
              banMap({
                teamId: user.team,
                matchId: match.id,
                mapName: map
              });
            };
            return (
              <div
                key={map}
                className="w-full p-2 flex items-center justify-center even:text-white even:bg-slate-700 odd:bg-slate-200 odd: text-black"
              >
                {map}
                {(user?.team === match.participants[0].team.id ||
                  user?.team === match.participants[1].team.id) &&
                  user?.team_status === "CAPTAIN" &&
                  match.bans?.previous_team !== user?.team && (
                    <button
                      onClick={handleBan}
                      className="p-1 rounded bg-black text-white ml-auto"
                    >
                      Забанить
                    </button>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MapBans;
