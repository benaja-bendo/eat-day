import { Routes, Route, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';
import Random from './pages/Random';
import Calendar from './pages/Calendar';
import IngredientSearch from './pages/IngredientSearch';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddRecipe />} />
            <Route path="/edit/:id" element={<EditRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/random" element={<Random />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/ingredients" element={<IngredientSearch />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
