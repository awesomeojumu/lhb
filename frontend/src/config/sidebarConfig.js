import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import routes from "./routesConfig";

const sidebarConfig = {
  globalSoldier: [
    { label: "Dashboard", icon: DashboardIcon, path: routes.dashboard },
    { label: "My KPIs", icon: TaskIcon, path: routes.myKpis },
    { label: "Battalion", icon: PeopleIcon, path: routes.battalion },
    { label: "Ranks", icon: AssignmentIndIcon, path: routes.ranks },
    { label: "Profile", icon: SettingsIcon, path: routes.profile },
  ],
  specialForce: [
    { label: "Dashboard", icon: DashboardIcon, path: routes.dashboard },
    { label: "My KPIs", icon: TaskIcon, path: routes.myKpis },
    { label: "Battalion", icon: PeopleIcon, path: routes.battalion },
    { label: "Ranks", icon: AssignmentIndIcon, path: routes.ranks },
    { label: "Profile", icon: SettingsIcon, path: routes.profile },
  ],
  commando: [
    { label: "Dashboard", icon: DashboardIcon, path: routes.dashboard },
    { label: "My KPIs", icon: TaskIcon, path: routes.myKpis },
    { label: "Battalion", icon: PeopleIcon, path: routes.battalion },
    { label: "Ranks", icon: AssignmentIndIcon, path: routes.ranks },
    { label: "Profile", icon: SettingsIcon, path: routes.profile },
    { divider: true },
    { label: "KPI Management", icon: TaskIcon, path: routes.kpiManagement },
    { label: "Battalion Management", icon: PeopleIcon, path: routes.battalionManagement },
    { label: "Role Management", icon: AdminPanelSettingsIcon, path: routes.roleManagement },
  ],
  commander: [
    { label: "Dashboard", icon: DashboardIcon, path: routes.dashboard },
    { label: "My KPIs", icon: TaskIcon, path: routes.myKpis },
    { label: "Battalion", icon: PeopleIcon, path: routes.battalion },
    { label: "Ranks", icon: AssignmentIndIcon, path: routes.ranks },
    { label: "Profile", icon: SettingsIcon, path: routes.profile },
    { divider: true },
    { label: "KPI Management", icon: TaskIcon, path: routes.kpiManagement },
    { label: "Battalion Management", icon: PeopleIcon, path: routes.battalionManagement },
    { label: "Role Management", icon: AdminPanelSettingsIcon, path: routes.roleManagement },
    { label: "User Management", icon: ManageAccountsIcon, path: routes.userManagement },
  ],
};

export default sidebarConfig;
