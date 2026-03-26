import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 404 route accessed
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <img
          src="/LogoJD.JPG"
          alt="JD Logo"
          className="h-12 sm:h-16 w-auto mx-auto mb-6 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
          title="Back to Home"
        />
        <h1 className="mb-4 text-3xl sm:text-4xl font-bold">404</h1>
        <p className="mb-4 text-base sm:text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
