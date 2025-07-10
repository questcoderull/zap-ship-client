import { createBrowserRouter } from "react-router";
import RootLayouts from "../layouts/RootLayouts";
import Home from "../Pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoute from "../Routs/PrivateRoute";
import SendPercel from "../SendPercel/SendPercel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/Payment/PaymentHistory";
import TracParcel from "../Pages/Dashboard/TracParcel";
import BeARider from "../Pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "../Routs/AdminRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import RiderRoute from "../Routs/RiderRoute";
import PendingDeliveries from "../Pages/Dashboard/PendingDeliveries/PendingDeliveries";
import CompeletedDeliveries from "../Pages/Dashboard/CompletedDeliveries/CompeletedDeliveries";
import MyEarnings from "../Pages/Dashboard/MyEarnings/MyEarnings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayouts,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "coverage",
        loader: () => fetch("./serviceCenter.json"),
        Component: Coverage,
      },
      {
        path: "forbidden",
        Component: Forbidden,
      },
      {
        path: "sendPercel",
        loader: () => fetch("./serviceCenter.json"),
        element: (
          <PrivateRoute>
            <SendPercel></SendPercel>
          </PrivateRoute>
        ),
      },
      {
        path: "beARider",
        loader: () => fetch("./serviceCenter.json"),
        element: (
          <PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "myParcels",
        Component: MyParcels,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "path",
        Component: TracParcel,
      },
      //Rider only
      {
        path: "pendingDeliveries",

        element: (
          <RiderRoute>
            <PendingDeliveries></PendingDeliveries>
          </RiderRoute>
        ),
      },
      {
        path: "completedDeliveries",
        element: (
          <RiderRoute>
            <CompeletedDeliveries></CompeletedDeliveries>
          </RiderRoute>
        ),
      },
      {
        path: "myEarnings",
        element: (
          <RiderRoute>
            <MyEarnings></MyEarnings>
          </RiderRoute>
        ),
      },

      // Admin only
      {
        path: "pendingRiders",
        // Component: PendingRiders,
        element: (
          <AdminRoute>
            <PendingRiders></PendingRiders>
          </AdminRoute>
        ),
      },
      {
        path: "activeRiders",
        // Component: ActiveRiders,
        element: (
          <AdminRoute>
            <ActiveRiders></ActiveRiders>
          </AdminRoute>
        ),
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoute>
            <MakeAdmin></MakeAdmin>
          </AdminRoute>
        ),
      },
      {
        path: "assignRider",
        element: (
          <AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>
        ),
      },
    ],
  },
]);
