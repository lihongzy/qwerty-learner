import type { Dictionary } from '@/shared/types/resource'

function appendToGroup<T>(groups: Record<string, T[]>, key: string, value: T) {
  ;(groups[key] ??= []).push(value)
}

// 按单个分组键聚合数组元素，常用于把词典按分类、语言等字段分组。
export default function groupBy<T>(elements: T[], iteratee: (value: T) => string) {
  return elements.reduce<Record<string, T[]>>((groups, value) => {
    appendToGroup(groups, iteratee(value), value)
    return groups
  }, Object.create(null) as Record<string, T[]>)
}

// 一个词典可能同时带有多个标签，所以这里会把同一个词典分发到多个 tag 分组里。
export function groupByDictTags(dicts: Dictionary[]) {
  return dicts.reduce<Record<string, Dictionary[]>>((groups, dict) => {
    dict.tags.forEach((tag) => {
      appendToGroup(groups, tag, dict)
    })

    return groups
  }, Object.create(null) as Record<string, Dictionary[]>)
}
