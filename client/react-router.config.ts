import type { Config } from "@react-router/dev/config";

export default {
  ssr: false, // 暫時關閉 SSR，快速驗證 500 是否來自於伺服器端渲染
} satisfies Config;
