import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CEEmpire from "./pages/CEEmpire";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={CEEmpire} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "rgba(8,17,37,.96)",
                border: "1px solid rgba(56,241,255,.36)",
                color: "#F8FCFF",
                borderRadius: "16px",
                boxShadow: "0 0 26px rgba(56,241,255,.14)",
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
