# survey-kit-h5

基于 Taro 4、React 18、TypeScript 和 Less 的项目，当前仅支持 **H5 和微信小程序（weapp）**，默认启动目标为 H5。其他平台暂不开发和验收。

## 双端开发约定

- 业务页面优先使用 Taro 组件与 API；浏览器专属 DOM、事件与组件通过 `TARO_ENV === 'h5'` 隔离，小程序分支使用 Taro / 微信能力。
- 首页与登录页必须同时考虑 H5 和微信端的布局、输入、点击、返回、安全区与键盘交互。H5 正常不代表小程序验收通过。
- 共用 Less 不使用 `*` 通配选择器；子元素优先命名 class。媒体查询使用 `max-width` / `min-width` 等传统语法，stylelint 已加入对应规则。
- 微信 WXSS 编译检查独立于 TypeScript、lint 和 Taro 编译；修改样式后需在微信开发者工具重新编译与预览。
- 日常验证使用 `yarn check`、`yarn dev:h5` 和 `yarn dev:weapp`。当前协作约定不自动执行生产打包，除非明确要求。
- 当前已移除其他平台命令与 RN 配置；模板中其他平台插件依赖暂时保留，不代表支持这些平台，后续清理依赖时再同步更新锁文件。

## 开发环境

- 使用 Node.js 24（已提供 `.nvmrc`），最低版本为 22.12。
- 使用 Yarn Classic 1.22.22，依赖版本由 `yarn.lock` 管理。

```sh
nvm use
yarn install --frozen-lockfile
yarn dev
```

未使用 nvm 时，直接安装兼容的 Node.js 即可。访问启动日志打印的本地地址。
如需指定端口：`yarn dev --port 10086`。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `yarn dev` / `yarn start` | 启动 H5 开发服务 |
| `yarn dev:test` | 使用测试环境变量启动 H5 |
| `yarn build` / `yarn build:h5` | H5 生产打包，输出至 `dist/h5/` |
| `yarn build:test` / `yarn build:h5:test` | H5 测试环境打包，输出至 `dist/h5/` |
| `yarn typecheck` | 检查业务代码和构建配置的 TypeScript 类型 |
| `yarn lint` | 检查代码与 CSS / Less 样式 |
| `yarn lint:fix` | 自动修复支持修复的代码和样式问题 |
| `yarn check` | 依次执行类型检查和全部 lint 检查 |
| `yarn dev:weapp` | 监听构建微信小程序 |
| `yarn dev:weapp:test` | 使用测试环境变量监听构建微信小程序 |
| `yarn build:weapp` | 微信小程序生产打包，输出至 `dist/weapp/` |
| `yarn build:weapp:test` | 微信小程序测试环境打包，输出至 `dist/weapp/` |

各平台产物按 `dist/<平台>/` 分开，H5 和小程序可同时启动。同一平台的不同环境共用输出目录，每次打包会更新该平台产物；不要同时启动和打包同一平台。

## 环境配置

`--mode` 选择业务环境文件，开发监听启用开发编译，普通打包启用生产压缩。`build:test` 使用 `.env.test`，同时保留生产压缩优化；不要用 `NODE_ENV=test` 代替它。运行这些命令时，不要另外设置与命令用途冲突的 `NODE_ENV`。

| 文件 | 用途 |
| --- | --- |
| `.env.development` | 本地开发默认值 |
| `.env.test` | 测试环境默认值 |
| `.env.production` | 生产环境默认值 |
| `.env.<环境>.local` | 本机覆盖值，已由 `.gitignore` 忽略 |

优先级由低到高为 `.env` → `.env.local` → `.env.<环境>` → `.env.<环境>.local` → 命令行进程环境变量。环境变量在编译时注入，修改后需要重新启动或打包。`TARO_APP_*` 会进入前端产物，不要填写密钥。

### H5 启动与接口代理

默认监听 `0.0.0.0:10086`，支持本机和局域网访问，开启热更新、开发 Source Map，不自动打开浏览器。端口被占用时 Taro 会自动选择空闲端口，以日志为准。

在 `.env.development.local` 中配置实际接口，例如：

```dotenv
TARO_APP_DEV_PORT=10086
TARO_APP_DEV_HOST=0.0.0.0
TARO_APP_API_BASE_URL=/api
TARO_APP_API_PROXY_TARGET=http://localhost:3000
```

运行 `yarn dev` 后，`/api/questions` 会代理到 `http://localhost:3000/api/questions`，保留 `/api` 前缀。目标为空时不启用代理。后端没有 `/api` 前缀时，需要在 `config/dev.ts` 的代理项里添加相应 `pathRewrite`。

业务代码通过 `import { appConfig } from '@/config'` 读取 `appConfig.apiBaseUrl`，它会根据 H5 / 微信小程序选择对应地址。这里只提供配置入口，尚未添加业务请求。

### H5 打包与部署

在 `.env.production.local` 中填写生产配置，测试环境对应 `.env.test.local`：

```dotenv
TARO_APP_PUBLIC_PATH=/survey/
TARO_APP_API_BASE_URL=https://api.example.com/api
```

示例地址需要替换为实际地址。`TARO_APP_PUBLIC_PATH` 默认 `/`，支持 `/survey/` 等子目录；使用 hash 路由。运行 `yarn build` 后，将 `dist/h5/` 内的文件部署到对应目录。生产资源使用内容哈希文件名、分离 CSS，并关闭 Source Map。

开发代理仅在本地开发服务中生效。部署后若继续使用 `/api`，需要部署服务器反向代理该路径；使用跨域完整接口地址时，需要后端允许相应跨域请求。

### 微信小程序启动与打包

在相应的 `.env.<环境>.local` 中填写：

```dotenv
TARO_APP_ID=你的小程序AppID
TARO_APP_WEAPP_API_BASE_URL=https://api.example.com/api
```

接口地址必须换成实际完整地址；小程序不会使用 H5 的本地代理。按平台要求配置实际服务域名。

1. 执行 `yarn dev:weapp`。
2. 在微信开发者工具中导入项目根目录，`project.config.json` 已指向 `dist/weapp/`；在工具中填写同一个真实 AppID。也可直接导入生成的 `dist/weapp/`，使用构建注入的 AppID。
3. 测试环境打包执行 `yarn build:weapp:test`；生产打包执行 `yarn build:weapp`。
4. 在微信开发者工具中预览、真机调试和上传。

未提供真实 AppID 时保留游客模式配置；打包成功不代表已经完成微信上传或发布。

## 提交检查

安装依赖时，`prepare` 脚本会配置 Husky Git hooks。

- `pre-commit`：lint-staged 对暂存的 `src/`、`config/`、`types/` 中的代码，以及 `src/` 下的样式执行检查和自动修复。
- `commit-msg`：commitlint 校验 Conventional Commits 格式，例如 `feat: 添加问卷首页`、`fix: 修复提交校验`、`chore: 更新开发配置`。
- 提交前建议执行 `yarn check`；完整类型检查不在每次提交的 hook 中执行。

如果 Git hooks 未启用，可运行 `yarn prepare` 重新配置。

## 配置说明

- `.eslintrc`：沿用 Taro React 规则；未使用变量视为错误，刻意保留的参数或变量可使用 `_` 前缀。
- `stylelint.config.mjs`：标准 CSS 规则，Less 使用 `postcss-less` 解析；允许模板空样式文件，并仅在 Less 文件中关闭不兼容的 CSS 函数和值检查。
- `tsconfig.json`：显式加载 Node、React、Webpack 环境类型，避免自动加载无效的 Sass 占位类型包。`skipLibCheck` 跳过现有第三方声明文件中的兼容性错误，业务代码仍执行类型检查。
- `config/index.ts`、`config/dev.ts`、`config/prod.ts`：Taro 通用、开发和生产构建配置。
- `.env.development`、`.env.test`、`.env.production`：业务环境变量；接口地址、开发服务和部署目录均可通过对应 `.local` 文件覆盖。
