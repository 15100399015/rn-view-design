import { SolidModelDataType, SolidPageDataType } from "@/DesignerScene/types";

export const modelData: SolidModelDataType = {
  id: "1",
  title: "baseui",
  description: "description",
  createUser: "admin",
  createTime: "2023-07-05 13:38:49",
  scenas: [
    {
      id: "1",
      parentId: "0",
      title: "场景1",
      pages: [
        {
          id: "2",
          parentId: "1",
          title: "测试页面",
          views: [],
          size: {
            width: 720,
            height: 1280,
          },
        },
      ],
    },
  ],
  size: { width: 0, height: 0 },
  frame: {},
  style: {},
};

export const pageData: SolidPageDataType = {
  id: "2",
  parentId: "1",
  title: "测试页面",
  size: {
    width: 720,
    height: 1280,
  },
  views: [
    {
      id: "5",
      title: "红包",
      position: {
        top: 0,
        left: 0,
      },
      size: {
        width: 160,
        height: 150,
      },
      type: "baseView",
      options: null,
      frame: {},
    },
  ],
};
