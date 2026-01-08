import AuthWrapper from '../../components/auth/AuthWrapper';


interface AuthPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}


const AuthPage = ({ searchParams }: AuthPageProps) => {

  // const view = searchParams.view === 'register' ? 'register' : 'login';

  // return (
  //   <AuthWrapper initialView={view} />
  // );
  return <AuthWrapper initialView="login" />;
};

export default AuthPage;
