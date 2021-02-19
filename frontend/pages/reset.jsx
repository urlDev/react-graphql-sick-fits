import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

const ResetPage = ({ query }) => {
  // query comes from query on url
  if (!query?.token) {
    return (
      <div>
        <p>Sorry! You must supply a token</p>
        <RequestReset />
      </div>
    );
  }
  return (
    <div>
      <Reset token={query.token} />
    </div>
  );
};

export default ResetPage;
