import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  //dar response.data currentUser gharar dare az backend miad
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />;
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users_/currentuser');
  //getinitialPropsi ke dar index.js bod ro ba in address run kardim
  //chon vaghti getinitialprops inja ke mikhai run konim dige on run nemishe
  //bekhatere inke inja mikhaim header bezarim ke roye hame page ha zaher beshe
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
