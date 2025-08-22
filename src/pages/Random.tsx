import { useNavigate } from 'react-router';
import RandomRecipe from '../components/RandomRecipe';

export default function Random() {
  const navigate = useNavigate();
  return (
    <div className="card-cartoon p-4">
      <RandomRecipe onEdit={(r) => navigate(`/edit/${r.id}`)} />
    </div>
  );
}
