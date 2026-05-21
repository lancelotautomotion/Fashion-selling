import {
  Package, TrendingUp, Coins, Clock,
  Pencil, Trash2, Plus, X,
  Camera, UploadCloud, ScanLine, CheckCircle2, Check,
  Bell, Calendar, Search, Info, PackageSearch, Circle,
} from 'lucide-react';

const ICONS = {
  package:         Package,
  'trending-up':   TrendingUp,
  coins:           Coins,
  clock:           Clock,
  pencil:          Pencil,
  'trash-2':       Trash2,
  plus:            Plus,
  x:               X,
  camera:          Camera,
  'upload-cloud':  UploadCloud,
  'scan-line':     ScanLine,
  'check-circle-2': CheckCircle2,
  check:           Check,
  bell:            Bell,
  calendar:        Calendar,
  search:          Search,
  info:            Info,
  'package-search': PackageSearch,
};

export default function Icon({ name, size = 16, className = '', strokeWidth = 2 }) {
  const LucideIcon = ICONS[name] ?? Circle;
  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      className={'inline-flex ' + className}
    />
  );
}
