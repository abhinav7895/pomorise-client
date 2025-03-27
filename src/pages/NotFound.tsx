import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="404 - Page Not Found | Pomorise"
        description="Page not found. Return to Pomorise's homepage to boost your productivity with our Pomodoro timer and more."
        keywords="404, page not found, pomorise, pomodoro timer"
        canonicalUrl="https://pomorise.vercel.app/404"
      />
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="shadow-md border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className=" flex flex-col sm:flex-row items-center justify-center gap-3 text-2xl font-bold">
                <AlertTriangle className="h-6 w-6 text-primary" />
                404 - Page Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground text-lg">
                Oops! It seems you've wandered off the productivity path.
                The page you're looking for doesn't exist.
              </p>
              <Button
                asChild
                className="w-full sm:w-auto px-6 py-2"
              >
                <a href="/" className="flex items-center justify-center gap-2">
                  Return to Home
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;