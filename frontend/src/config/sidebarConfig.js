import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AssessmentIcon from "@mui/icons-material/Assessment";

import routes from "@config/routesConfig";

const d = routes.dashboard;

const sidebarConfig = {
    globalSoldier: [
        { label: "Dashboard", icon: DashboardIcon, path: d },
        { label: "My KPIs", icon: TaskIcon, path: `${d}/${routes.myKpis}` },
        { label: "Battalion", icon: PeopleIcon, path: `${d}/${routes.battalion}` },
        { label: "Ranks", icon: AssignmentIndIcon, path: `${d}/${routes.ranks}` },
        { label: "Profile", icon: SettingsIcon, path: `${d}/${routes.profile}` },
    ],
    specialForce: [
        { label: "Dashboard", icon: DashboardIcon, path: d },
        { label: "My KPIs", icon: TaskIcon, path: `${d}/${routes.myKpis}` },
        { label: "Battalion", icon: PeopleIcon, path: `${d}/${routes.battalion}` },
        { label: "Ranks", icon: AssignmentIndIcon, path: `${d}/${routes.ranks}` },
        { label: "Profile", icon: SettingsIcon, path: `${d}/${routes.profile}` },
    ],
    commando: [
        { label: "Dashboard", icon: DashboardIcon, path: d },
        { label: "My KPIs", icon: TaskIcon, path: `${d}/${routes.myKpis}` },
        { label: "Battalion", icon: PeopleIcon, path: `${d}/${routes.battalion}` },
        { label: "Ranks", icon: AssignmentIndIcon, path: `${d}/${routes.ranks}` },
        { label: "Profile", icon: SettingsIcon, path: `${d}/${routes.profile}` },
        { divider: true },
        {
            label: "Management Dashboard",
            icon: AssessmentIcon,
            path: `${d}/${routes.dashboardManagement}`,
        },
        {
            label: "KPI Management",
            icon: TaskIcon,
            path: `${d}/${routes.kpiManagement}`,
        },
        {
            label: "Battalion Management",
            icon: PeopleIcon,
            path: `${d}/${routes.battalionManagement}`,
        },
        {
            label: "Role Management",
            icon: AdminPanelSettingsIcon,
            path: `${d}/${routes.roleManagement}`,
        },
    ],
    commander: [
        { label: "Dashboard", icon: DashboardIcon, path: d },
        { label: "My KPIs", icon: TaskIcon, path: `${d}/${routes.myKpis}` },
        { label: "Battalion", icon: PeopleIcon, path: `${d}/${routes.battalion}` },
        { label: "Ranks", icon: AssignmentIndIcon, path: `${d}/${routes.ranks}` },
        { label: "Profile", icon: SettingsIcon, path: `${d}/${routes.profile}` },
        { divider: true },
        {
            label: "Management Dashboard",
            icon: AssessmentIcon,
            path: `${d}/${routes.dashboardManagement}`,
        },
        {
            label: "KPI Management",
            icon: TaskIcon,
            path: `${d}/${routes.kpiManagement}`,
        },
        {
            label: "Battalion Management",
            icon: PeopleIcon,
            path: `${d}/${routes.battalionManagement}`,
        },
        {
            label: "Role Management",
            icon: AdminPanelSettingsIcon,
            path: `${d}/${routes.roleManagement}`,
        },
        {
            label: "User Management",
            icon: ManageAccountsIcon,
            path: `${d}/${routes.userManagement}`,
        },
    ],
};

export default sidebarConfig;
