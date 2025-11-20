/// <reference types="vite/client" />

// 1. tsconfig.app.json に "types": ["vite/client"] がないと以下のエラーになる
//    error TS2307: Cannot find module './assets/globals.css' or its corresponding type declarations.

// 2. vue-router を使っていた時は問題なかったが、vue-router を削除して以降、vue-tsc で以下のエラーが出るように。
//    error TS7016: Could not find a declaration file for module './App.vue'. '/Volumes/Internal/work/hardhat3/ui/app/App.vue' implicitly has an 'any' type.

// 3. 環境を初期化、最初からやり直してもエラーになる。

// 4. 自力で定義すれば良いのだが、では、なぜ今まで問題なかったのか？

// declare module "*.vue" {
//   import type { DefineComponent } from "vue";
//   const component: DefineComponent<{}, {}, any>; // eslint-disable-line
//   export default component;
// }

// 5. vue-tsc が 3.1.5 になったら出なくなった。。。
