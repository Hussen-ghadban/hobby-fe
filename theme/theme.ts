export const getTheme = (isDark: boolean) => ({
  bgColor: isDark ? "bg-gray-900" : "bg-gray-50",
  headerBgColor: isDark ? "bg-gray-800" : "bg-white",
  headerBorderColor: isDark ? "border-gray-700" : "border-gray-200",
  headerTextColor: isDark ? "text-white" : "text-gray-900",
  subTextColor: isDark ? "text-gray-400" : "text-gray-500",
  emptyTextColor : isDark ? "text-white" : "text-gray-900",

  // Cards
  cardBgColor: isDark ? "bg-gray-800" : "bg-white",
  cardBorderColor: isDark ? "border-gray-700" : "border-gray-200",
  cardNameColor: isDark ? "text-white" : "text-gray-900",
  cardColorCodeColor: isDark ? "text-gray-400" : "text-gray-500",
  cardButtonBgColor : isDark ? "bg-gray-700" : "bg-gray-800",

  // Counts / badges
  countBgColor: isDark ? "bg-gray-700" : "bg-gray-100",
  countTextColor: isDark ? "text-white" : "text-gray-900",
  badgeBgColor: isDark ? "bg-gray-700" : "bg-gray-100",
  badgeTextColor: isDark ? "text-gray-300" : "text-gray-600",
  iconColor: isDark ? "#D1D5DB" : "#374151",

accentColor: isDark ? "purple-400" : "purple-600",


  // FAB
  fabBgColor: isDark ? "bg-white" : "bg-gray-900",
  fabTextColor: isDark ? "#111827" : "#FFFFFF",

  // Modal
  modalBgColor: isDark ? "bg-gray-800" : "bg-white",
  modalBorderColor: isDark ? "border-gray-700" : "border-gray-200",
  modalHeaderBorderColor: isDark ? "border-gray-700" : "border-gray-200",

  // Inputs
  inputBgColor: isDark ? "bg-gray-900" : "bg-gray-50",
  inputBorderColor: isDark ? "border-gray-700" : "border-gray-300",
  inputTextColor: isDark ? "text-white" : "text-gray-900",
  labelColor: isDark ? "text-gray-300" : "text-gray-700",
  dropdownBgColor : isDark ? "bg-gray-700" : "bg-gray-100",

  // Icons / Empty state
  emptyIconBgColor: isDark ? "bg-gray-700" : "bg-gray-200",

  // Buttons
  buttonBgColor: isDark ? "bg-gray-700" : "bg-gray-900",
  buttonTextColor: "text-white",
  cancelTextColor: isDark ? "text-gray-300" : "text-gray-600",

  // Handle bar
  handleBarColor: isDark ? "bg-gray-600" : "bg-gray-300",
});
