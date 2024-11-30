import { useAuth, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;
    // You can add additional auth logic here if needed
  }, [isLoaded, navigate]);

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default AuthWrapper;