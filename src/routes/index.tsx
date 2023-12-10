import React from "react";
import { RouteObject } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DesignerScene from "@/pages/DesignerScene/DesignerScene";
import DesignerView from "@/pages/DesignerView/DesignerView";
import TestPage from "@/pages/TestPage/TestPage";
const routes: RouteObject[] = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <DesignerScene />,
      },
      {
        path: "/designer",
        element: <DesignerView />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
    ],
  },
];

export default routes;
