export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-2)] py-16 px-4">
      <div className="max-w-[760px] mx-auto bg-[var(--card)] rounded-xl shadow-sm p-8 sm:p-10">

        <h1 className="text-2xl font-bold text-[var(--text)] mb-1">이용약관</h1>
        <p className="text-sm text-[var(--muted)] mb-8">시행일: 2025년 1월 1일</p>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제1조 (목적)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            본 약관은 WhatisF1(이하 "사이트")이 제공하는 포뮬러 원(F1) 관련 정보 서비스의 이용 조건 및 절차, 이용자와 사이트 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제2조 (서비스 내용)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">
            사이트는 다음의 서비스를 제공합니다.
          </p>
          <ul className="text-sm text-[var(--muted)] leading-relaxed list-disc pl-5 flex flex-col gap-1">
            <li>F1 관련 뉴스 및 정보 제공</li>
            <li>경기 일정, 결과, 드라이버·팀 순위 제공</li>
            <li>하이라이트 영상 링크 제공</li>
            <li>팬 투표 및 예측 기능</li>
          </ul>
          <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">
            본 사이트는 Formula 1® 및 관련 단체와 공식 제휴 관계에 있지 않은 비공식 정보 제공 사이트입니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제3조 (이용자의 의무)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">이용자는 다음 행위를 해서는 안 됩니다.</p>
          <ul className="text-sm text-[var(--muted)] leading-relaxed list-disc pl-5 flex flex-col gap-1">
            <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
            <li>사이트 운영을 방해하거나 서버에 과도한 부하를 주는 행위</li>
            <li>사이트에서 제공하는 콘텐츠를 무단으로 복제·배포하는 행위</li>
            <li>기타 관련 법령에 위반되는 행위</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제4조 (서비스 이용 제한)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            사이트는 이용자가 본 약관을 위반하거나 서비스의 정상적인 운영을 방해한 경우, 사전 통보 없이 서비스 이용을 제한할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제5조 (책임의 한계)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            사이트에서 제공하는 정보는 참고 목적으로만 제공되며, 정확성을 보장하지 않습니다. 공식 정보는 반드시 F1.com을 통해 확인하시기 바랍니다. 사이트는 서비스 이용으로 발생한 손해에 대해 법적 책임을 지지 않습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제6조 (약관의 변경)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            사이트는 관련 법령 변경 또는 서비스 정책에 따라 본 약관을 변경할 수 있으며, 변경 시 사이트 내 공지를 통해 안내합니다. 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제7조 (문의)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            이용약관에 관한 문의사항은 아래 이메일로 연락해 주시기 바랍니다.<br />
            이메일: whatisf1@gmail.com
          </p>
        </section>

      </div>
    </main>
  )
}
