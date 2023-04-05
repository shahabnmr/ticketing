import buildClient from "../api/build-client";
const LandingPage = ({ currentUser }) => {
  //dar response.data currentUser gharar dare az backend miad
  return currentUser ? (
    <h1>{currentUser.email}</h1>
  ) : (
    <h1>You are Not Sign In</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users_/currentuser");
  return data;
};

export default LandingPage;
