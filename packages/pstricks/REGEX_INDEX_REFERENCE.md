# 正则表达式匹配组索引参考

本文档记录了所有 PSTricks 命令的正则表达式匹配组索引，确保代码中使用的索引正确。

## 匹配组索引规则

在 JavaScript 正则表达式中：
- `m[0]`: 完整匹配的字符串（不使用）
- `m[1]`, `m[2]`, `m[3]`...: 捕获组（capturing groups），按从左到右的顺序编号

## RE 常量定义

```typescript
RE.options = '(\\[[^\\]]*\\])?'      // 捕获组 1: 选项部分 [options]
RE.type = '(\\{[^\\}]*\\})?'         // 捕获组: 类型/箭头 {->}
RE.coords = '\\(\\s*([^\\)]*),([^\\)]*)\\s*\\)'  // 捕获组 2 个: (x,y)
RE.coordsOpt = '(\\(\\s*([^\\)]*),([^\\)]*)\\s*\\))?'  // 可选坐标
RE.squiggle = '\\{([^\\}]*)\\}'      // 捕获组 1 个: {value}
RE.squiggleOpt = '(\\{[^\\}]*\\})?'  // 可选值
```

## 各命令的匹配组索引

### 1. psframe

**正则表达式**: `'\\\\psframe' + RE.options + RE.coords + RE.coords`

**匹配组**:
- `m[0]`: 完整匹配
- `m[1]`: options（选项部分）
- `m[2]`: x1（第一个坐标的 x）
- `m[3]`: y1（第一个坐标的 y）
- `m[4]`: x2（第二个坐标的 x）
- `m[5]`: y2（第二个坐标的 y）

**代码使用**:
```typescript
x1: X.call(this, m[2]),  // ✅ 正确
y1: Y.call(this, m[3]),  // ✅ 正确
x2: X.call(this, m[4]),  // ✅ 正确
y2: Y.call(this, m[5]),  // ✅ 正确
if (m[1]) Object.assign(obj, parseOptions(m[1])); // ✅ 正确
```

---

### 2. pscircle

**正则表达式**: `'\\\\pscircle' + RE.options + RE.coords + RE.squiggle`

**匹配组**:
- `m[0]`: 完整匹配
- `m[1]`: options
- `m[2]`: cx（圆心 x）
- `m[3]`: cy（圆心 y）
- `m[4]`: r（半径）

**代码使用**:
```typescript
cx: X.call(this, m[2]),  // ✅ 正确
cy: Y.call(this, m[3]),  // ✅ 正确
r: this.xunit * Number(m[4]), // ✅ 正确
if (m[1]) Object.assign(obj, parseOptions(m[1])); // ✅ 正确
```

---

### 3. psellipse

**正则表达式**: `'\\\\psellipse' + RE.options + RE.coords + RE.coords`

**匹配组**:
- `m[0]`: 完整匹配
- `m[1]`: options
- `m[2]`: cx（圆心 x）
- `m[3]`: cy（圆心 y）
- `m[4]`: rx（x 半径）
- `m[5]`: ry（y 半径）

**代码使用**:
```typescript
cx: X.call(this, m[2]),  // ✅ 正确
cy: Y.call(this, m[3]),  // ✅ 正确
rx: this.xunit * Number(m[4]), // ✅ 正确
ry: this.yunit * Number(m[5]), // ✅ 正确
if (m[1]) Object.assign(obj, parseOptions(m[1])); // ✅ 正确
```

---

### 4. psgrid

**正则表达式**: `'\\\\psgrid' + RE.options + RE.coords + RE.coords + RE.squiggle`

**匹配组**:
- `m[0]`: 完整匹配
- `m[1]`: options
- `m[2]`: x0（起始 x）
- `m[3]`: y0（起始 y）
- `m[4]`: x1（结束 x）
- `m[5]`: y1（结束 y）
- `m[6]`: gridsize（网格大小）

**代码使用**:
```typescript
x0: X.call(this, m[2]),  // ✅ 正确
y0: Y.call(this, m[3]),  // ✅ 正确
x1: X.call(this, m[4]),  // ✅ 正确
y1: Y.call(this, m[5]),  // ✅ 正确
gridsize: Number(m[6]),  // ✅ 正确
if (m[1]) Object.assign(obj, parseOptions(m[1])); // ✅ 正确
```

---

### 5. psline

**正则表达式**: `'\\\\psline' + RE.options + RE.type + RE.coords + RE.coordsOpt`

**匹配组**:
- `m[0]`: 完整匹配
- `m[1]`: options
- `m[2]`: type/arrows（箭头类型 `{->}`）
- `m[3]`: x1（第一个坐标的 x）
- `m[4]`: y1（第一个坐标的 y）
- `m[5]`: 第二个坐标完整字符串（如果存在）`(x2,y2)`
- `m[6]`: x2（第二个坐标的 x，如果存在）
- `m[7]`: y2（第二个坐标的 y，如果存在）

**代码使用**:
```typescript
var options = m[1];  // ✅ 正确
var lineType = m[2]; // ✅ 正确
if (m[5]) {  // 检查是否有第二个坐标
  obj.x1 = X.call(this, m[3]);  // ✅ 正确
  obj.y1 = Y.call(this, m[4]);  // ✅ 正确
  obj.x2 = X.call(this, m[6]);  // ✅ 正确
  obj.y2 = Y.call(this, m[7]);  // ✅ 正确
} else {
  obj.x1 = X.call(this, 0);
  obj.y1 = Y.call(this, 0);
  obj.x2 = X.call(this, m[3]);  // ✅ 正确（只有一个坐标时）
  obj.y2 = Y.call(this, m[4]);  // ✅ 正确
}
```

---

### 6. psarc

**正则表达式**: `'\\\\psarc' + RE.options + RE.type + RE.coords + RE.squiggle + RE.squiggle + RE.squiggle`

**匹配组**:
- `m[0]`: 完整匹配
- `m[1]`: options
- `m[2]`: type/arrows（箭头类型）
- `m[3]`: cx（圆心 x）
- `m[4]`: cy（圆心 y）
- `m[5]`: r（半径）
- `m[6]`: angleA（起始角度）
- `m[7]`: angleB（结束角度）

**代码使用**:
```typescript
var l = parseArrows(m[2]); // ✅ 正确
if (m[1]) Object.assign(obj, parseOptions(m[1])); // ✅ 正确
if (m[3]) obj.cx = X.call(this, m[3]); // ✅ 正确
if (m[4]) obj.cy = Y.call(this, m[4]); // ✅ 正确
obj.r = radius * this.xunit; // m[5] ✅ 正确
obj.angleA = (Number(m[6]) * Math.PI) / 180; // ✅ 正确
obj.angleB = (Number(m[7]) * Math.PI) / 180; // ✅ 正确
```

---

### 7. userline

**正则表达式**: `'\\\\userline' + RE.options + RE.type + RE.coords + RE.coords + RE.squiggleOpt + RE.squiggleOpt + RE.squiggleOpt + RE.squiggleOpt`

**匹配组**:
- `m[0]`: 完整匹配
- `m[1]`: options
- `m[2]`: type/arrows（箭头类型）
- `m[3]`: x1（第一个坐标的 x）
- `m[4]`: y1（第一个坐标的 y）
- `m[5]`: x2（第二个坐标的 x）
- `m[6]`: y2（第二个坐标的 y）
- `m[7]`: xExp（可选的 x 表达式）
- `m[8]`: yExp（可选的 y 表达式）
- `m[9]`: xExp2（可选的第二个 x 表达式）
- `m[10]`: yExp2（可选的第二个 y 表达式）

**代码使用**:
```typescript
var options = m[1];  // ✅ 正确
var lineType = m[2]; // ✅ 正确
x1: X.call(this, m[3]), // ✅ 正确
y1: Y.call(this, m[4]), // ✅ 正确
x2: X.call(this, m[5]), // ✅ 正确
y2: Y.call(this, m[6]), // ✅ 正确
var xExp = m[7];  // ✅ 正确（可选）
var yExp = m[8];  // ✅ 正确（可选）
var xExp2 = m[9]; // ✅ 正确（可选）
var yExp2 = m[10]; // ✅ 正确（可选）
```

---

## 历史修改记录

### psframe 的修改

**修改前**:
```typescript
psframe: /\\psframe\(\s*(.*),(.*)\s*\)\(\s*(.*),(.*)\s*\)/,
// 匹配组: m[1]=x1, m[2]=y1, m[3]=x2, m[4]=y2（无选项）
```

**修改后**:
```typescript
psframe: new RegExp('\\\\psframe' + RE.options + RE.coords + RE.coords),
// 匹配组: m[1]=options, m[2]=x1, m[3]=y1, m[4]=x2, m[5]=y2
```

**索引调整**:
- 原来: `m[1], m[2], m[3], m[4]`
- 现在: `m[2], m[3], m[4], m[5]`（因为添加了 `m[1]` 作为 options）

**修复状态**: ✅ 已修复（从 `m[3], m[4], m[5], m[6]` 修正为 `m[2], m[3], m[4], m[5]`）

---

## 验证测试

所有索引已通过自动化测试验证：
- ✅ `test/regex-index-verification.test.ts` - 所有 7 个测试通过

---

## 注意事项

1. **选项部分总是 `m[1]`**: 如果正则表达式包含 `RE.options`，选项部分总是 `m[1]`
2. **坐标索引偏移**: 添加选项后，所有坐标索引都需要 +1
3. **可选组**: `RE.coordsOpt` 和 `RE.squiggleOpt` 会产生额外的捕获组，即使值为 `undefined`
4. **测试验证**: 修改正则表达式后，务必运行 `regex-index-verification.test.ts` 验证索引正确性

---

**最后更新**: 2026-01-30  
**验证状态**: ✅ 所有索引已验证正确
