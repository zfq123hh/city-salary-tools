export const tools = [
  { slug: "annual-bonus-tax", name: "年终奖个税计算器", short: "按全年一次性奖金口径估算应纳税额", category: "个税", priority: 0.85, kind: "bonus" },
  { slug: "retirement-age", name: "退休年龄计算器", short: "按出生年月和性别估算退休时间", category: "社保", priority: 0.82, kind: "retirement" },
  { slug: "mortgage", name: "房贷计算器", short: "等额本息和等额本金月供估算", category: "贷款", priority: 0.80, kind: "mortgage" },
  { slug: "car-loan", name: "车贷计算器", short: "估算车贷月供、总利息和总还款", category: "贷款", priority: 0.72, kind: "carLoan" },
  { slug: "deposit-interest", name: "存款利息计算器", short: "按本金、年利率和期限估算利息", category: "理财", priority: 0.70, kind: "deposit" },
  { slug: "compound-interest", name: "复利计算器", short: "估算长期投资复利增长", category: "理财", priority: 0.70, kind: "compound" },
  { slug: "working-days", name: "工作日计算器", short: "计算两个日期之间的工作日数量", category: "日期", priority: 0.68, kind: "workingDays" },
  { slug: "age", name: "年龄计算器", short: "按出生日期计算周岁、虚岁和天数", category: "日期", priority: 0.68, kind: "age" },
  { slug: "bmi", name: "BMI 计算器", short: "按身高体重计算 BMI 和体重状态", category: "健康", priority: 0.65, kind: "bmi" }
];

export const cityToolTypes = [
  { slug: "salary-tax-calculator", label: "税后工资计算器", kind: "salary", priority: 0.95 },
  { slug: "social-security-calculator", label: "社保计算器", kind: "social", priority: 0.90 },
  { slug: "housing-fund-calculator", label: "公积金计算器", kind: "fund", priority: 0.88 }
];
