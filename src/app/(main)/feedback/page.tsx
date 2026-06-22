'use client'

import { useState } from 'react'

type Category = 'bug' | 'feature' | 'other'

const CATEGORIES: { value: Category; label: string; desc: string }[] = [
  { value: 'bug',     label: '버그 신고',  desc: '오작동·오류 발견' },
  { value: 'feature', label: '기능 제안',  desc: '추가됐으면 하는 기능' },
  { value: 'other',   label: '기타',       desc: '의견·건의·칭찬 등' },
]

export default function FeedbackPage() {
  const [category, setCategory]   = useState<Category | null>(null)
  const [content,  setContent]    = useState('')
  const [email,    setEmail]      = useState('')
  const [status,   setStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, content, email: email || undefined }),
      })

      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? '오류가 발생했습니다.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMsg('네트워크 오류가 발생했습니다.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className="flex-1 bg-[var(--bg-2)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-5">🙏</div>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-3">감사합니다!</h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-8">
            소중한 의견이 잘 전달됐어요.<br />
            더 나은 서비스를 만드는 데 반영하겠습니다.
          </p>
          <button
            onClick={() => {
              setCategory(null)
              setContent('')
              setEmail('')
              setStatus('idle')
            }}
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--muted)] bg-transparent cursor-pointer hover:bg-[var(--hover-bg)] transition-colors"
          >
            추가 피드백 보내기
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-[var(--bg-2)] px-4 py-10">
      <div className="w-full max-w-lg mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-1">피드백</h1>
          <p className="text-sm text-[var(--muted)]">버그·기능 제안·의견을 알려주세요. 로그인 없이도 보낼 수 있어요.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* 카테고리 */}
          <div>
            <p className="text-sm font-semibold text-[var(--text)] mb-2.5">유형 선택 <span className="text-[var(--accent)]">*</span></p>
            <div className="grid grid-cols-3 gap-2.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={[
                    'flex flex-col items-center gap-1 py-3.5 px-2 rounded-xl border text-center transition-all cursor-pointer',
                    category === cat.value
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                      : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--hover-bg)]',
                  ].join(' ')}
                >
                  <span className="text-sm font-semibold">{cat.label}</span>
                  <span className={`text-[11px] leading-tight ${category === cat.value ? 'text-white/80' : 'text-[var(--muted)]'}`}>
                    {cat.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label htmlFor="content" className="text-sm font-semibold text-[var(--text)] mb-2.5 block">
              내용 <span className="text-[var(--accent)]">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={
                category === 'bug'     ? '어떤 상황에서 문제가 발생했는지 알려주세요.' :
                category === 'feature' ? '어떤 기능이 있으면 좋을지 설명해주세요.' :
                '자유롭게 의견을 남겨주세요.'
              }
              maxLength={1000}
              rows={5}
              required
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm px-4 py-3 placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <p className="text-right text-xs text-[var(--muted)] mt-1">{content.length} / 1000</p>
          </div>

          {/* 이메일 (선택) */}
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-[var(--text)] mb-2.5 block">
              이메일 <span className="text-xs font-normal text-[var(--muted)]">(선택 — 답변 원하실 때)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm px-4 py-3 placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {/* 에러 메시지 */}
          {status === 'error' && (
            <p className="text-sm text-[var(--accent)] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
              {errorMsg}
            </p>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={!category || content.trim().length < 5 || status === 'loading'}
            className="w-full py-3.5 rounded-xl text-sm font-semibold bg-[var(--accent)] text-white border-none cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {status === 'loading' ? '전송 중...' : '피드백 보내기'}
          </button>

          <p className="text-xs text-center text-[var(--muted)]">
            제출된 내용은 서비스 개선 목적으로만 사용되며 외부에 공개되지 않아요.
          </p>

        </form>
      </div>
    </main>
  )
}
