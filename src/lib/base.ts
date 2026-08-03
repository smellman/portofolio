// astro.config の base に追従してリンク先を組み立てるヘルパー。
// 現在は base 未設定(ルート配信 '/')だが、将来サブパス配信に戻しても
// import.meta.env.BASE_URL を通して自動で正しいパスになる。
// サーバー(.astro)・クライアント(React)どちらからも利用できる。
const BASE = import.meta.env.BASE_URL;

/** base path を先頭に付けた絶対パスを返す。base='/' なら withBase('/oss') -> '/oss' */
export function withBase(path = ""): string {
  const b = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}` || "/";
}
