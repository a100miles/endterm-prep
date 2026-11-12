import { useEffect, useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  BookOpen,
  Layers,
  PenLine,
  Timer,
  ChartNoAxesColumn,
  Bookmark,
  House,
  Menu,
  X,
  Moon,
  Sun,
  Cloud,
  Search,
  Library,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./components/ui/button";
import { useStudy } from "./lib/store";
import {
  Dashboard,
  Learn,
  Review,
  Statistics,
  Sources,
  SearchPage,
} from "./pages/Study";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
const nav = [
  ["/", "Overview", House],
  ["/learn", "Learn", BookOpen],
  ["/flashcards", "Flashcards", Layers],
  ["/practice", "Practice", PenLine],
  ["/exam", "Mock exam", Timer],
  ["/review", "Review", Bookmark],
  ["/stats", "Progress", ChartNoAxesColumn],
  ["/sources", "Sources", Library],
] as const;
export default function App() {
  const { progress, update, storageError } = useStudy();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target as HTMLElement).closest("input,textarea,select")
      ) {
        e.preventDefault();
        navigate("/search");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
  useEffect(() => {
    document.documentElement.dataset.theme = progress.dark ? "dark" : "light";
  }, [progress.dark]);
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="mobile-header">
        <Link to="/" className="brand">
          <Cloud /> Endterm Prep.
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </header>
      {open && (
        <button
          className="nav-scrim"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <Link to="/" className="brand">
          <Cloud /> Endterm Prep<span>.</span>
        </Link>
        <p className="sidebar-sub">AWS Cloud Developing</p>
        <nav aria-label="Main navigation">
          {nav.map(([path, label, Icon]) => (
            <NavLink key={path} end={path === "/"} to={path}>
              <Icon size={19} />
              {label}
              {path === "/review" && progress.bookmarks.length > 0 && (
                <span className="nav-count">{progress.bookmarks.length}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p>
            Built around your lectures.
            <br />
            Ready when you are.
          </p>
          <Button
            variant="ghost"
            onClick={() => update((p) => ({ ...p, dark: !p.dark }))}
          >
            {progress.dark ? <Sun size={18} /> : <Moon size={18} />}{" "}
            {progress.dark ? "Light mode" : "Dark mode"}
          </Button>
        </div>
      </aside>
      <div className="workspace">
        <div className="topbar">
          <span>Personal study space</span>
          <Link to="/search" className="search-link">
            <Search size={17} /> Search topics & terms <kbd>/</kbd>
          </Link>
        </div>
        {storageError && (
          <div className="notice" role="alert">
            Your browser could not save progress. Keep this tab open and free
            browser storage before continuing.
          </div>
        )}
        <main id="main" tabIndex={-1}>
          <motion.div
            key={location.pathname.split("/")[1]}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:moduleId" element={<Learn />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/practice" element={<Quiz exam={false} />} />
              <Route path="/exam" element={<Quiz exam />} />
              <Route path="/review" element={<Review />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="*"
                element={
                  <div className="empty">
                    <h1>Page not found</h1>
                    <Link to="/">Return to overview</Link>
                  </div>
                }
              />
            </Routes>
          </motion.div>
        </main>
        <footer>
          Endterm Prep.{" "}
          <span>Study notes from your six AWS Academy modules.</span>
        </footer>
      </div>
    </div>
  );
}
