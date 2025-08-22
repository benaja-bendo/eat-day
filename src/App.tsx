import { Routes, Route, useLocation } from 'react-router';
import { useTransition, animated } from '@react-spring/web';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';
import Random from './pages/Random';
import Calendar from './pages/Calendar';

export default function App() {
  const location = useLocation();
  const transitions = useTransition(location, {
    keys: (loc) => loc.pathname,
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  });

  return transitions((style, item) => (
    <animated.div style={style} className="min-h-screen">
      <Routes location={item}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/edit/:id" element={<EditRecipe />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/random" element={<Random />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </animated.div>
  ));
}
