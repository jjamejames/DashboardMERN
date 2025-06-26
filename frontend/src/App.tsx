import {
  AuthBindings,
  Authenticated,
  GitHubBanner,
  Refine,
  useGetIdentity,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { CredentialResponse } from "./interfaces/google";
import { Login } from "./pages/login";
import { parseJwt } from "./utils/parse-jwt";
////////////////////////////////////////////////////
import Title from "./components/title";
import { ThemedLayoutV2 } from "./components/layout";
import {
  Agent,
  AgentProfile,
  AllProperties,
  CreateProperties,
  EditProperties,
  Home,
  Message,
  PropertyDetail,
  Review,
} from "./pages";

import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StarRateIcon from "@mui/icons-material/StarRate";
import ChatIcon from "@mui/icons-material/Chat";
import Person2Icon from "@mui/icons-material/Person2";
/////////////////////////////////////////////////
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj) {
        ///////////////////////////////////// ทำการ connect กับ backend โดยเมื่อทำการ log in ให้ทำการ post user ลงใน database
        const response = await fetch("http://localhost:8080/api/v1/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profileObj.name,
            email: profileObj.email,
            avatar: profileObj.picture,
          }),
        });
        const data = await response.json();
        if (response.status == 200) {
          // เข้าถึง user ได้ ก็จะให้เก็บ token ไว้ใน localstorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              userID: data._id,
            })
          );
          localStorage.setItem("token", `${credential}`);
        }
        // console.log(profileObj)
        //////////////////////////////////////

        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
      };
    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };

  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider("http://localhost:8080/api/v1")} //refine จะ map resource name (เช่น "Properties") เป็น path เล็ก (/properties) ต่อท้าย base URL ที่ตั้งใน dataProvideraction ที่ใช้ (list, create, show, edit) จะกำหนด method (GET, POST, PUT, DELETE) และ endpoint ให้อัตโนมัติ
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={[
                  {
                    name: "Dashboard",
                    icon: <SpaceDashboardIcon />,
                    list: "/home",
                    // create: "/blog-posts/create",
                    // edit: "/blog-posts/edit/:id",
                    // show: "/blog-posts/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                  {
                    name: "Properties",
                    icon: <HomeIcon></HomeIcon>,
                    list: "/properties", // ตัว key เป็น ตัวกำหนด method
                    create: "/properties/create", // เป็นการเพิ่ม sidebar active ก็คือเมื่อเข้า path นี้ sidebar ยังจะ active อยู่ที่ Properties
                    show: "/properties/show/:id",
                    edit: "/properties/edit/:id",
                    // show: "/blog-posts/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                  {
                    name: "Agents",
                    icon: <PeopleAltIcon></PeopleAltIcon>,
                    list: "/agents",
                    // create: "/blog-posts/create",
                    // edit: "/blog-posts/edit/:id",
                    // show: "/blog-posts/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                  {
                    name: "Reviews",
                    icon: <StarRateIcon></StarRateIcon>,
                    list: "/reviews",
                    // create: "/blog-posts/create",
                    // edit: "/blog-posts/edit/:id",
                    // show: "/blog-posts/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                  {
                    name: "Messages",
                    icon: <ChatIcon></ChatIcon>,
                    list: "/messages",
                    // create: "/blog-posts/create",
                    // edit: "/blog-posts/edit/:id",
                    // show: "/blog-posts/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                  {
                    name: "MyProfile",
                    icon: <Person2Icon></Person2Icon>,
                    list: "/profile",
                    // create: "/blog-posts/create",
                    // edit: "/blog-posts/edit/:id",
                    // show: "/blog-posts/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "i22m0P-Mk9GC9-2IvGE4",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Title={({ collapsed }) => (
                            <Title collapsed={collapsed} />
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="Dashboard" />}
                    />
                    <Route path="/home">
                      <Route index element={<Home></Home>}></Route>
                    </Route>
                    <Route path="/properties">
                      <Route
                        index
                        element={<AllProperties></AllProperties>}
                      ></Route>
                      <Route
                        path="create"
                        element={<CreateProperties />}
                      ></Route>
                      <Route
                        path="show/:id"
                        element={<PropertyDetail />}
                      ></Route>
                      <Route
                        path="edit/:id"
                        element={<CreateProperties />}
                      ></Route>
                    </Route>
                    <Route path="/agents">
                      <Route index element={<Agent></Agent>}></Route>
                    </Route>
                    <Route path="/reviews">
                      <Route index element={<Review></Review>}></Route>
                    </Route>
                    <Route path="/messages">
                      <Route index element={<Message></Message>}></Route>
                    </Route>
                    <Route path="/profile">
                      <Route
                        index
                        element={<AgentProfile></AgentProfile>}
                      ></Route>
                    </Route>

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
