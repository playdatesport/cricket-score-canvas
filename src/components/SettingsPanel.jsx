import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const SettingsPanel = () => (
  <Link to="/settings" className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors inline-flex">
    <Settings className="w-5 h-5" />
  </Link>
);

export default SettingsPanel;
