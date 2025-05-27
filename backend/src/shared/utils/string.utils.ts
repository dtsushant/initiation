export function permissionPath(
  module: string,
  action: string,
  partyCode?: string,
): string {
  const partyPrefix = partyCode ? `${partyCode}::` : '';
  return `${partyPrefix}${module}::${action}`;
}
