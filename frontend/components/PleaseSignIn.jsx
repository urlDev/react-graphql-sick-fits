import SignIn from './SignIn';
import { useUser } from './User';

const PleaseSignIn = ({ children }) => {
  const me = useUser();
  if (!me) return <SignIn />;
  return children;
};

export default PleaseSignIn;
