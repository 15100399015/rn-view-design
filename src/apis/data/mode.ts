import { SolidModelDataType } from "@/types/solid";

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
          title: "页1",
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

export const pageData = {
  projectId: "1",
  page: {
    name: null,
    id: 2,
  },
  size: {
    width: 720,
    height: 1280,
  },
  views: [
    {
      id: 5,
      title: "baseView",
      position: {
        top: "0", 
        left: "0",
      },
      size: {
        width: "160",
        height: "150",
      },
      type: "baseView",
      options: null,
    },
    {
      id: 6,
      title: "textView",
      position: {
        top: "550",
        left: "0",
      },
      size: {
        width: "160",
        height: "150",
      },
      type: "textView",
      options: null,
    },
  ],
};
