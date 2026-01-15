import AuthWrapper from '../../components/auth/AuthWrapper';


interface AuthPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}


const AuthPage = ({ searchParams }: AuthPageProps) => {

  return <AuthWrapper initialView="login" />;
};

export default AuthPage;
