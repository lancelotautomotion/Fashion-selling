import {
  Package, TrendingUp, Coins, Clock,
  Pencil, Trash2, Plus, X, XCircle,
  Camera, UploadCloud, ScanLine, CheckCircle2, Check, CheckCircle,
  Bell, Calendar, CalendarRange, Search, Info, PackageSearch, Circle,
  Loader2, AlertCircle, LogOut,
  LayoutDashboard, BarChart2, BarChart3, Activity, Timer,
  ShoppingBag, LayoutGrid, List, Layers, FolderSearch, Shirt,
} from 'lucide-react';

const ICONS = {
  package:           Package,
  'trending-up':     TrendingUp,
  coins:             Coins,
  clock:             Clock,
  pencil:            Pencil,
  'trash-2':         Trash2,
  plus:              Plus,
  x:                 X,
  'x-circle':        XCircle,
  camera:            Camera,
  'upload-cloud':    UploadCloud,
  'scan-line':       ScanLine,
  'check-circle-2':  CheckCircle2,
  'check-circle':    CheckCircle,
  check:             Check,
  bell:              Bell,
  calendar:          Calendar,
  'calendar-range':  CalendarRange,
  search:            Search,
  info:              Info,
  'package-search':  PackageSearch,
  loader:            Loader2,
  'alert-circle':    AlertCircle,
  'log-out':         LogOut,
  /* Navigation */
  'layout-dashboard': LayoutDashboard,
  'bar-chart-2':      BarChart2,
  'bar-chart-3':      BarChart3,
  /* Statistics */
  activity:           Activity,
  timer:              Timer,
  'shopping-bag':     ShoppingBag,
  /* Catalogue */
  'layout-grid':      LayoutGrid,
  list:               List,
  layers:             Layers,
  'folder-search':    FolderSearch,
  shirt:              Shirt,
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
