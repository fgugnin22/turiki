// import React, { useEffect } from "react";
// import Layout from "../hocs/Layout";
// import { tournamentAPI } from "../rtk/tournamentAPI";
// const Test = () => {
//     // const result = authAPI.useGetUserQuery({
//     //     access: localStorage.getItem("access"),
//     // });
//     // const [register] = authAPI.useRegisterUserMutation();
//     // const [checkAccess, { isLoading, isError, isSuccess }] =
//     //     authAPI.useCheckAccessMutation();
//     // const [login, {isSuccess}] = authAPI.useLoginMutation()
//     const [applyForTeam, {}] = tournamentAPI.useApplyForTeamMutation();
//     const [leaveFromTeam, {}] = tournamentAPI.useLeaveFromTeamMutation();
//     useEffect(() => {
//         // console.log(login({
//         //     email: prompt('email'),
//         //     password: prompt('password')
//         // }))
//         // console.log(
//         // register({
//         //     email: prompt("email"),
//         //     name: prompt("name"),
//         //     password: prompt("password"),
//         //     re_password: prompt("re_password"),
//         // })
//         // );
//         // console.log(checkAccess({ access: localStorage.getItem("access") }));
//     }, []);

//     return (
//         <Layout>
//             <button
//                 onClick={() =>
//                     applyForTeam({
//                         teamId: prompt("teamid"),
//                         userId: prompt("userid"),
//                         userName: prompt("username"),
//                     })
//                 }
//             >
//                 Apply for team
//             </button>
//             <button
//                 onClick={() =>
//                     leaveFromTeam({
//                         teamId: prompt("teamid"),
//                         userId: prompt("userid"),
//                         userName: prompt("username"),
//                     })
//                 }
//             >
//                 Leave from team
//             </button>
//         </Layout>
//     );
// };

// export default Test;
export {}