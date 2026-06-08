'use client'

import { useEffect, useState } from 'react'

function detectInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /KAKAOTALK|Instagram|FBAN|FBAV|Line\/|NAVER|Daum/i.test(ua)
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent)
}

export default function InAppBrowserNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(detectInAppBrowser())
  }, [])

  if (!show) return null

  const handleOpenExternal = () => {
    const url = window.location.href
    if (isAndroid()) {
      // Android: Chrome intent URL로 외부 브라우저 강제 실행
      window.location.href =
        'intent://' + url.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end;'
    }
    // iOS는 프로그래밍으로 강제 불가 → 아래 안내 문구로 대체
  }

  return (
    <div className="w-[320px] bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3.5 flex flex-col gap-2 text-sm">
      <p className="font-bold text-yellow-800">인앱 브라우저 감지됨</p>
      <p className="text-yellow-700 leading-snug">
        카카오톡 등 앱 내 브라우저에서는 <span className="font-semibold">Google 로그인이 차단</span>됩니다.
        카카오 로그인을 이용하거나, 외부 브라우저에서 접속해 주세요.
      </p>
      <div className="flex flex-col gap-1.5 mt-0.5">
        <button
          onClick={handleOpenExternal}
          className="w-full py-2 rounded-lg bg-yellow-400 text-yellow-900 font-semibold text-xs hover:bg-yellow-500 transition-colors"
        >
          외부 브라우저로 열기 (Android)
        </button>
        <p className="text-[11px] text-yellow-600 text-center leading-snug">
          iPhone: 우측 하단 <span className="font-semibold">···</span> 메뉴 → <span className="font-semibold">Safari로 열기</span>
        </p>
      </div>
    </div>
  )
}
