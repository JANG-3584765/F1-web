import { signIn } from '@/auth'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-2)] flex items-center justify-center px-4 py-20">
      <div className="w-[320px] bg-[var(--card)] rounded-xl shadow-md p-7">

        <h2 className="text-[22px] font-bold text-center text-[var(--text)] mb-2">로그인 / 회원가입</h2>
        <p className="text-sm text-center text-[var(--muted)] mb-7">소셜 계정으로 간편하게 시작하세요</p>

        <div className="flex flex-col gap-3">
          <form action={async () => {
            'use server'
            await signIn('google', { redirectTo: '/' })
          }}>
            <button
              type="submit"
              className="w-full py-3 flex items-center justify-center gap-2.5 border border-[var(--border)] rounded-md bg-[var(--card)] text-[var(--text)] text-sm font-medium cursor-pointer hover:bg-[var(--bg-2)] transition-colors"
            >
              <img src="/images/common/google_logo.svg" alt="Google" className="w-5 h-5" />
              Google로 계속하기
            </button>
          </form>

          <form action={async () => {
            'use server'
            await signIn('kakao', { redirectTo: '/' })
          }}>
            <button
              type="submit"
              className="w-full py-3 flex items-center justify-center gap-2.5 border-none rounded-md bg-[#FEE500] text-[#191919] text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img src="/images/common/kakao_logo.svg" alt="Kakao" className="w-5 h-5" />
              카카오로 계속하기
            </button>
          </form>
        </div>

      </div>
    </main>
  )
}
