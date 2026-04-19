import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Valuation from "./pages/Valuation";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import JoinUs from "./pages/JoinUs";
import Referrals from "./pages/Referrals";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalDeals from "./pages/portal/PortalDeals";
import PortalTasks from "./pages/portal/PortalTasks";
import PortalLeads from "./pages/portal/PortalLeads";
import PortalListings from "./pages/portal/PortalListings";
import PortalValuations from "./pages/portal/PortalValuations";
import PortalProfile from "./pages/portal/PortalProfile";
import AdminAgents from "./pages/portal/AdminAgents";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/properties" component={Properties} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/valuation" component={Valuation} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/about" component={About} />
      <Route path="/join-us" component={JoinUs} />
      <Route path="/referrals" component={Referrals} />
      {/* Staff Portal Routes */}
      <Route path="/portal" component={PortalDashboard} />
      <Route path="/portal/deals" component={PortalDeals} />
      <Route path="/portal/tasks" component={PortalTasks} />
      <Route path="/portal/leads" component={PortalLeads} />
      <Route path="/portal/listings" component={PortalListings} />
      <Route path="/portal/valuations" component={PortalValuations} />
      <Route path="/portal/profile" component={PortalProfile} />
      <Route path="/portal/agents" component={AdminAgents} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
