export const stringShort = (str: any, len = 13, start = 4, end = 6) => {
  if (!str) return str
  if (str.length <= len) {
    return str
  }
  return `${str.substr(0, start)}...${str.substr(-end)}`
}

export const rndNbr = (from = 0, to = 100) => {
  return 0
}
