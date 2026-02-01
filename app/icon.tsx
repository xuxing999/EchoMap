import { ImageResponse } from 'next/og';

// 圖示配置
export const runtime = 'edge';
export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

// 生成動態圖示
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 地圖 Pin 外框 */}
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="#4A5D4E"
            stroke="white"
            strokeWidth="0.5"
          />

          {/* 黑膠唱片 - 外圈 */}
          <circle
            cx="12"
            cy="9"
            r="3.5"
            fill="white"
            opacity="0.9"
          />

          {/* 黑膠唱片 - 紋路圈 1 */}
          <circle
            cx="12"
            cy="9"
            r="2.8"
            fill="none"
            stroke="#4A5D4E"
            strokeWidth="0.3"
            opacity="0.6"
          />

          {/* 黑膠唱片 - 紋路圈 2 */}
          <circle
            cx="12"
            cy="9"
            r="2.2"
            fill="none"
            stroke="#4A5D4E"
            strokeWidth="0.3"
            opacity="0.6"
          />

          {/* 黑膠唱片 - 中心孔 */}
          <circle
            cx="12"
            cy="9"
            r="1.2"
            fill="#4A5D4E"
          />

          {/* 音符裝飾 */}
          <path
            d="M13 7.5 L13 10 M13 7.5 L14.5 7 L14.5 9.5"
            stroke="white"
            strokeWidth="0.4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="13" cy="10.2" r="0.4" fill="white" />
          <circle cx="14.5" cy="9.7" r="0.4" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
