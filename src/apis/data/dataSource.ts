// 数据源类型
export const dataSourceTypeList = [
  {
    id: "1",
    name: "mysql",
    description: "mysql",
    option: "mysql",
    classifier: "mysql",
    icon: "mysql",
    layers: 3,
    updateUser: "",
  },
];
// 数据源列表
export const dataSourceList = {
  totalList: [
    {
      id: "1",
      dataSourceName: "localhost1",
      dataSourceTypeId: 1,
      createTime: "2023-07-05 13:37:39",
      dataSourceDesc: "",
      expire: false,
    },
    {
      id: "2",
      dataSourceName: "localhost2",
      dataSourceTypeId: 1,
      createTime: "2023-07-05 13:37:39",
      dataSourceDesc: "",
      expire: false,
    },
  ],
  total: 1,
  totalPage: 1,
  pageSize: 10000,
  currentPage: 1,
  start: 0,
};

export const dataSourceTable = {
  "1": [
    "information_schema",
    "mysql",
    "performance_schema",
    "solidui",
    "sys",
    "test",
  ],
  "2": [
    "information_schema2",
    "mysql2",
    "performance_schema2",
    "solidui2",
    "sys2",
    "test2",
  ],
};

// 数据源数据
export const dataSourceData = {
  "1": [
    ["name", "val"],
    ["n1", "10"],
    ["n2", "30"],
    ["n3", "60"],
    ["n4", "100"],
    ["n5", "120"],
  ],
  "2": [
    ["name", "val"],
    ["组1", "120"],
    ["组1", "100"],
    ["组1", "60"],
    ["组1", "40"],
    ["组1", "20"],
  ],
};
