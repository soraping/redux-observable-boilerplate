### redux-observable 使用小记

最近用 `redux-observable` 搭建了一个样板项目，起先我就被人安利过这个库，由于自己工作的关系，一直没能用上，恰巧最近项目不紧，遂搭一个简单项目来瞅瞅，下面就请跟着我的步伐一步一步的探索这个库的奥秘。

#### `redux-observable` 背景

这个库是基于 `rxjs` 基础上，为 `redux` 提供的异步解决方案。

> **`redux` 的异步流**

原本 `redux` 的 `action creator` 只提供一个同步的 `action` 但随着业务的扩展，在某个场景下需要异步的 `action` 来延时调用 `dispatch`。
经典的库有 `redux-thunk`，`redux-saga`以及`redux-observable`。

- **`redux-thunk`**

`redux-thunk`的代码很短，很巧妙的使用了 `redux` 的 `applyMiddleware` 中间件模式，它让 `action creator` 不仅可以输出 `plain object`，也可以输出一个 `function` 来处理 `action`，而这个 `function` 传递的参数就是 上下文的 `dispatch`，当这个 `function` 在某个时段执行时，就可以实现延时触发 `dispatch` 了。

**这个就是一个典型的函数式编程的案例，巧用了闭包，让 `dispatch` 方法在函子内没有被销毁。 **

[`redux-thunk` 及其 `applyMiddleware` 源码解读](https://github.com/soraping/any-source/blob/master/doc/redux/applyMiddleware.md)

![redux-thunk 流程](https://ws1.sinaimg.cn/large/e221b779gy1g1ih6vf5auj212a0dm762.jpg)

但是这也是有一定的缺点的，就拿常用的 `ajax` 请求来说，每个 `action creator` 输出的 `function` 不尽相同，异步操作分散，而且逻辑也千变万化，`action` 多了，就不易维护了。

- **`redux-saga`**

**`redux-saga` 是另一种异步流，不过它的 `action` 是统一形式的，并且会集中处理异步操作。**

可以理解 `redux-saga` 做了一个监听器，专门监听 `action` ，此处的 `action` 就是 `plain object` ，当接收到 UI 触发了某个 `action` 时， `redux-saga` 就会触发相应的 `effects` 来处理对应的副作用函数，这个函数返回的也是一个 `plain object` 的 `action`给 `reducer`。

这样做的好处是，`redux-saga` 接收了异步函数的管理，将复杂的业务逻辑部分与 `redux` 解耦，这也是 `redux` 设计的初衷，`action` 始终是 `plain object`，而且 `redux-saga` 提供了不少工具函数来处理异步流，极大的方便了开发者处理异步。

![redux-saga 简易流程](https://ws1.sinaimg.cn/large/e221b779gy1g1ihanfsnlj21b00dsgny.jpg)

网上有诸多教程，这里就不一一赘述了。

不过有点郁闷的就是 `redux-saga` 使用的是 `generator`，写起来还要在 `function` 那里加个 `*`，在我个人看来非常的不习惯，就是特别的别扭。

- **`redux-observable`**

`redux-observable` 和 `redux-saga` 有些类似，可以理解为它是将 `action` 当作即是 `observable` 也是 `observer`（发布者与订阅者），就是 `rxjs` 的 `Subject`对象，他是数据流的中转站，能够订阅上游数据流，也能被一个或者多个下游订阅。

`redux-observable` 将从 ui 触发的 `action` 转化为一个数据流，并且订阅它。当数据流有数据发出时，这个流的数据管道中设置了对此数据流做的一系列的操作符，或者是高阶 `observable`，数据流通过管道后，将最终的流转成 `action`。

**上述所说的管道就是由 `rxjs` 提供的操作符组合**

#### 在 `redux` 中使用 `redux-observable`

现在开始做一个简易的项目（调用 github api 获取用户的头像和名称）：

- 安装 `redux` 全家桶

常规的 `redux` 项目所需的库，基本上都会用到

```bash
yarn add react react-dom redux react-redux react-router redux-logger ...
yarn add -D webpack webpack-cli ...
```

- 安装 `redux-observable`

```bash
yarn add rxjs redux-observable

# ts声明库
yarn add -D @types/rx
```

- 目录结构

```bash
.
├── actions
├── components
├── constants
├── epics
├── reducers
├── types
└── utils
├── index.html
├── index.tsx
├── routes.tsx
├── store.ts
```

- 解读 Epics

从上面的目录结构就能看出，比常规的 `redux` 项目多了一个 `epics` 目录，这个目录是存放什么文件呢。

`redux-observable` 的核心就是 `Epics` ，它是一个函数，接收一个 `action` (plain object) ，返回一个 `action` 流，它是一个 `Observable` 对象。

函数签名：

```js
function (action$: Observable<Action>, store: Store): Observable<Action>;
```

**从 `Epics` 函数出来的 `action` 已经是一个 `Observable` 对象了，是一个上游数据流了，可以被各种 `rxjs` 操作符操作了。**

数据流的终端就是一个订阅者，这个订阅者只做一件事儿，就是被 `store.dispatch` 分发至 `reducer`

```js
epic(action$, store).subscribe(store.dispatch);
```

redux-observable 简易流程：

![redux-observable 简易流程](https://ws1.sinaimg.cn/large/e221b779ly1g1ii2xoxz7j21cy0h4dir.jpg)

- 编码

```js
import { USER } from "@constants";
import { createAction } from "typesafe-actions";

export namespace userActions {
  export const getGitHubUser = createAction(USER.GITHUB_USER_API);

  export const setUserInfo = createAction(USER.SET_USER_INFO, resolve => user =>
    resolve(user)
  );
}
```

建立一个 user 的操作 action，定义两个 action

epic 文件：

```js
import { ofType, ActionsObservable } from "redux-observable";
import { throwError } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { getType } from "typesafe-actions";
import { userActions } from "@actions";

const url = "https://api.github.com/users/soraping";

export const userEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(getType(userActions.getGitHubUser)),
    switchMap(() => {
      return ajax.getJSON(url).pipe(
        map(res => userActions.setUserInfo(res)),
        catchError(err => throwError(err))
      );
    })
  );
```

建立一个 `userEpic` ,它是一个高阶函数，这个高阶函数携带的参数就是 `action$` ，它就是一个上游数据流，这个函数的基础逻辑就是一个 `rxjs` 的一般操作了。

上游 `action$` 的数据管道中，监听 action 的变化，当 `getType` 方法就是获得 `action` 的 `type` 是 操作符 `oftype` 返回的一致，则继续管道后面的操作，`switchMap` 是一个高阶的操作符，它一般用在 `ajax` 网络服务请求上，主要处理多个内部 `Observable` 对象产生并发的情况下，只订阅最后一个数据源，其他的都退订，这样的操作符，非常适合网络请求。

这个网络请求就是获取 github 的 api，当获取数据后，调用 `action creator` 方法传递获取的数据，这个时候并没有返回一个真正的 `plain object` ，而是一个最终的 `action$` 数据流，触发 `subscribe` 的 `store.dispatch(action)` 方法，将 `plain action` 送至 `reducer`。

[`typesafe-actions`](https://github.com/piotrwitek/typesafe-actions) 库是一个 `action` 封装库，简化了 `action` 的操作，它和 `redux-actions` 很像，但是`typesafe-actions`这个库对 `epic` 支持得很好。

整合多个`epic`：

```js
import { combineEpics } from "redux-observable";
import { userEpic } from "./user";
export const rootEpic = combineEpics(userEpic);
```

`combineEpics` 方法用来整合多个 epic 高阶方法，它类似与 `reducers` 的 `combineReducers`。

那么，epic 方法已经有了，`redux-observable` 毕竟是一个中间件，它在 `store` 中的操作：

```js
import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";
import { createBrowserHistory } from "history";
import { rootReducer } from "./reducers";
import { rootEpic } from "./epics";

export const history = createBrowserHistory();

const epicMiddleware = createEpicMiddleware();

const middlewares = [
  createLogger({ collapsed: true }),
  epicMiddleware,
  routerMiddleware(history)
];

export default createStore(
  rootReducer(history),
  composeWithDevTools(applyMiddleware(...middlewares))
);

// run 方法一定要在 createStore 方法之后
epicMiddleware.run(rootEpic);
```

将`epicMiddleware`注册到 redux 中间件中，这样，就能接收到上下文的 `action` 和 `dispatch`，不过要注意的是，`epicMiddleware`要在`store`设置之后，执行 run 方法，这和 `redux-saga`一致。

这样，基本上 `redux` 和 `redux-observable` 组合的基本操作已经差不多了，`reducer` 的操作基本不变

[上述例子的 github 源码](https://github.com/soraping/redux-observable-boilerplate.git)

```bash
yarn && yarn start

# localhost:8000
```

喜欢的话给个 star 啊！

#### 推荐学习路径

最后说下学习路径：

> 函数式编程

从头开始学编程吧，用函数式，纯函数的那种。

> `redux` 源码阅读

大牛的作品，闭包用的炉火纯青，各种高阶函数，精妙绝伦的操作大大降低了代码量，更能看到函数式编程的妙处。

[`redux`源码阅读参考](https://github.com/soraping/any-source)

> `rxjs` 及其操作符

响应式编程的系统学习，但不必要所有操作符都过一遍，这里推荐一本书 《深入浅出 rxjs》，不过书里的版本是 v5 的，官网是 v6 的，除了一些改变外，原理都是相同的。
