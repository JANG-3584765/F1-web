export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-2)] py-16 px-4">
      <div className="max-w-[760px] mx-auto bg-[var(--card)] rounded-xl shadow-sm p-8 sm:p-10">

        <h1 className="text-2xl font-bold text-[var(--text)] mb-1">개인정보처리방침</h1>
        <p className="text-sm text-[var(--muted)] mb-8">시행일: 2025년 1월 1일</p>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제1조 (수집하는 개인정보)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">
            사이트는 소셜 로그인(Google, 카카오) 서비스를 통해 아래 정보를 수집합니다.
          </p>
          <ul className="text-sm text-[var(--muted)] leading-relaxed list-disc pl-5 flex flex-col gap-1">
            <li>이름(닉네임)</li>
            <li>이메일 주소</li>
            <li>프로필 사진</li>
          </ul>
          <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">
            위 정보는 이용자가 소셜 로그인 시 해당 플랫폼으로부터 제공받으며, 사이트가 직접 수집하지 않습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제2조 (개인정보의 이용 목적)</h2>
          <ul className="text-sm text-[var(--muted)] leading-relaxed list-disc pl-5 flex flex-col gap-1">
            <li>회원 식별 및 로그인 상태 유지</li>
            <li>팬 투표 등 서비스 이용 기록 관리</li>
            <li>서비스 이용 관련 공지 전달</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제3조 (개인정보의 보유 및 이용 기간)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            수집된 개인정보는 서비스 이용 기간 동안 보유하며, 회원 탈퇴 또는 서비스 종료 시 지체 없이 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보유할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제4조 (개인정보의 제3자 제공)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            사이트는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만, 법령에 의한 요청이 있는 경우에는 예외로 합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제5조 (쿠키의 사용)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            사이트는 로그인 세션 유지를 위해 쿠키를 사용합니다. 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 로그인 등 일부 서비스 이용이 제한될 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제6조 (이용자의 권리)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">
            이용자는 언제든지 아래 권리를 행사할 수 있습니다.
          </p>
          <ul className="text-sm text-[var(--muted)] leading-relaxed list-disc pl-5 flex flex-col gap-1">
            <li>개인정보 열람 요청</li>
            <li>개인정보 수정 요청</li>
            <li>서비스 탈퇴 및 개인정보 삭제 요청</li>
          </ul>
          <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">
            위 사항은 아래 문의처로 요청하시면 처리해 드립니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제7조 (문의)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            개인정보처리방침에 관한 문의사항은 아래 이메일로 연락해 주시기 바랍니다.<br />
            이메일: whatisf1@gmail.com
          </p>
        </section>

      </div>
    </main>
  )
}
