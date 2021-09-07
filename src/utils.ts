export function deepEqual(a: any, b: any): boolean {
  if (typeof a !== typeof b || typeof a === "symbol" || typeof b === "symbol") {
    return false;
  }
  // 之后 a b 的 typeof 都一致

  // 基本类型直接比较
  if (
    typeof a === "number" ||
    typeof a === "string" ||
    typeof a === "bigint" ||
    typeof a === "boolean"
  ) {
    return a === b;
  }

  // 函数比较 toString
  if (typeof a === "function") {
    return a.toString() === b.toString();
  }

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return a.every((item, index) => deepEqual(item, b[index]));
    }
    return false;
  }

  // 处理对象
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  // 先查 key 数组是否一致
  if (
    aKeys.length !== bKeys.length ||
    !aKeys.every((key) => bKeys.findIndex((bKey) => bKey === key) !== -1)
  ) {
    return false;
  }

  // 检查每个 field 是否一致
  return aKeys.every((key) => deepEqual(a[key], b[key]));
}
