const DICT = {
  // 注册资金
  RegisteredMoney: [
    {
      label: '0-1000万',
      dicValue: 1
    }, {
      label: '1001-5000万',
      dicValue: 2
    }, {
      label: '5001-15000万',
      dicValue: 3
    }, {
      label: '15001万以上',
      dicValue: 4
    }
  ],
  // 选择花型上架位置
  StockingArr: [
    {
      name: '全局',
      desc: '上架到【统搜57平台】，所有用户都可以看到。',
      dicValue: 2
    }, {
      name: '网店',
      desc: '上架到【我的网店】，仅访问我的网店用户可以看到。',
      dicValue: 1
    }, {
      name: '仓库',
      desc: '下架到【我的仓库】，只有我才可以看到。',
      dicValue: 0
    }
  ],
  // 搜索类型
  SearchType: [
    {
      dicValue: 1,
      label: '店内'
    }, {
      dicValue: 2,
      label: '平台'
    }
  ],
  // 人数
  Nop: [
    {
      label: '0-20',
      dicValue: 1
    }, {
      label: '21-50',
      dicValue: 2
    }, {
      label: '51-100',
      dicValue: 3
    }, {
      label: '101以上',
      dicValue: 4
    }
  ],
  // 营业额
  Turnover: [
    {
      label: '0-1000万',
      dicValue: 1
    }, {
      label: '1001-5000万',
      dicValue: 2
    }, {
      label: '5001-15000万',
      dicValue: 3
    }, {
      label: '15001万以上',
      dicValue: 4
    }
  ],
  // 企业类型
  CompanyType: [
    {
      label: '蕾丝生产企业',
      dicValue: 1
    }, {
      label: '贸易企业',
      dicValue: 2
    }, {
      label: '服装生产企业',
      dicValue: 3
    }, {
      label: '其他企业',
      dicValue: 4
    }
  ],
  // 花型分类SupplyType
  SupplyType: [
    {
      label: '面料',
      dicValue: 100010
    }, {
      label: '大边',
      dicValue: 100011
    }, {
      label: '小边',
      dicValue: 100012
    }, {
      label: '睫毛',
      dicValue: 100013
    }
  ],
  // 是否接受开机 BuyStatus
  BuyStatus: [
    {
      label: '接受',
      dicValue: 1
    }, {
      label: '不接受',
      dicValue: 0
    }
  ],
  // 是否有库存
  isStock: [
    {
      label: '需要开机',
      label2: '无库存',
      dicValue: 0
    }, {
      label: '有库存',
      label2: '有库存',
      dicValue: 1
    }
  ],
  // 单位
  PriceUnits: [
    {
      label: '公斤',
      dicValue: 400011
    }, {
      label: '码',
      dicValue: 400010
    }, {
      label: '条',
      dicValue: 400012
    }
  ],
  // 库存单位
  StockUnits: [
    {
      label: '公斤',
      dicValue: 400011
    }, {
      label: '码',
      dicValue: 400010
    }, {
      label: '条',
      dicValue: 400012
    }
  ],
  // 大货类型
  SupplyShapes: [
    {
      label: '胚布',
      dicValue: 200010
    }, {
      label: '成品',
      dicValue: 200011
    }
  ],
  // 上架至
  PublishStatus: [
    {
      label: '平台',
      label2: '平台',
      title: '上架后花型将平台所有用户开放',
      dicValue: 2
    }, {
      label: '网店',
      label2: '网店',
      title: '上架后必须访问店铺才能查看花型',
      dicValue: 1
    }, {
      label: '未上传',
      label2: '仓库',
      title: '未上传的花型',
      dicValue: 0
    }
    // , {
    //   label: '本地仓库',
    //   label2: '本地仓库',
    //   title: '花型信息不对外公开，仅限内部管理',
    //   dicValue: 0
    // }
  ],
  // 注册资本
  InititalMoney: [
    {
      label: '0-1000万',
      dicValue: 1
    }, {
      label: '1000-3000万',
      dicValue: 2
    }, {
      label: '3001-5000万',
      dicValue: 3
    }, {
      label: '5001万',
      dicValue: 4
    }
  ],
  // 企业类型
  FirmType: [
    {
      label: '服装生产企业',
      dicValue: 1
    }, {
      label: '蕾丝生产企业',
      dicValue: 2
    }, {
      label: '贸易企业',
      dicValue: 3
    }, {
      label: '其他企业',
      dicValue: 4
    }
  ],
  // 员工数量
  FirmPersonArr: [
    {
      label: '0-20',
      dicValue: 1
    }, {
      label: '21-50',
      dicValue: 2
    }, {
      label: '51-100',
      dicValue: 3
    }, {
      label: '101以上',
      dicValue: 4
    }
  ],
  // 年营业额
  TotalMoney: [
    {
      label: '0-1000万',
      dicValue: 1
    }, {
      label: '1001-5000万',
      dicValue: 2
    }, {
      label: '5001-15000万',
      dicValue: 3
    }, {
      label: '150001万以上',
      dicValue: 4
    }
  ],
  SupplyStatus: [
    {
      label: '供应中',
      dicValue: 1
    }, {
      label: '已关闭',
      dicValue: 2
    }
  ],
  // 询价人身份
  userType: [
    {
      label: '工厂',
      dicValue: 1
    }, {
      label: '贸易商',
      dicValue: 2
    }
  ],
  // 采购类型
  purchaseType: [
    {
      label: '剪样',
      dicValue: 1
    }, {
      label: '剪版',
      dicValue: 3
    }, {
      label: '下大货',
      dicValue: 2
    }
  ],
  // 设备数量
  MachineNum: [
    {
      label: '0-10台',
      dicValue: 1
    }, {
      label: '11-20台',
      dicValue: 2
    }, {
      label: '21-50台',
      dicValue: 3
    }, {
      label: '51台以上',
      dicValue: 4
    }
  ],
  // 运费设置
  FreightSetting: [
    {
      label: '运费到付',
      dicValue: 1,
      tip: '货物运达目的地后由收货人给付运费，如有任何异议可联系卖家沟通协商。如有疑问可咨询【坐视布管】客服：4008-013357'
    }, {
      label: '上门自提',
      dicValue: 2,
      tip: '买家需要自己到卖家指定地点提货'
    }, {
      label: '卖家包邮',
      dicValue: 3,
      tip: '运费由卖家承担'
    }, {
      label: '在线付运费',
      dicValue: 4,
      tip: '订单总金额包含相关商品总金额及运费，卖家在线一并支付这两项费用'
    }, {
      label: '送货上门',
      dicValue: 5,
      tip: '卖家需要送货上门到买家指定地点'
    }
  ],
  // 关闭订单理由
  CloseOrderReasons: [
    {
      label: '缺货',
      dicValue: 1
    }, {
      label: '价格不合适',
      dicValue: 2
    }, {
      label: '买家下错单',
      dicValue: 3
    }, {
      label: '无法满足备货期要求',
      dicValue: 4
    }, {
      label: '其他理由',
      dicValue: 5
    }
  ]
};
export default DICT;
