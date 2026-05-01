export default function OperationPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-2)] py-16 px-4">
      <div className="max-w-[760px] mx-auto bg-[var(--card)] rounded-xl shadow-sm p-8 sm:p-10">

        <h1 className="text-2xl font-bold text-[var(--text)] mb-1">운영정책</h1>
        <p className="text-sm text-[var(--muted)] mb-8">시행일: 2025년 1월 1일</p>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제1조 (운영 원칙)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            WhatisF1은 F1 팬들이 정확한 정보를 편리하게 접할 수 있도록 공정하고 투명하게 운영됩니다. 모든 이용자가 쾌적하게 서비스를 이용할 수 있는 환경을 유지하는 것을 최우선으로 합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제2조 (금지 행위)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">다음 행위는 금지되며, 적발 시 서비스 이용이 제한될 수 있습니다.</p>
          <ul className="text-sm text-[var(--muted)] leading-relaxed list-disc pl-5 flex flex-col gap-1">
            <li>타인을 사칭하거나 허위 정보를 유포하는 행위</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>팬 투표 등 서비스를 비정상적인 방법으로 조작하는 행위</li>
            <li>사이트 내 콘텐츠를 무단으로 크롤링·복제하는 행위</li>
            <li>관련 법령을 위반하는 일체의 행위</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제3조 (콘텐츠 저작권)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            본 사이트에서 제공하는 F1 관련 이미지, 영상, 데이터 등의 권리는 Formula 1® 및 각 권리자에게 있으며, 정보 제공 목적으로만 활용됩니다. 사이트 자체 제작 콘텐츠(로고, 디자인 등)의 무단 사용을 금합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제4조 (서비스 변경 및 중단)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            사이트는 운영상 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다. 서비스 변경·중단 시 가능한 경우 사전에 공지합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제5조 (제재 기준)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">
            운영정책 위반 정도에 따라 아래와 같이 조치할 수 있습니다.
          </p>
          <ul className="text-sm text-[var(--muted)] leading-relaxed list-disc pl-5 flex flex-col gap-1">
            <li>경고: 경미한 위반 행위 최초 발생 시</li>
            <li>일시 이용 제한: 반복 위반 또는 중대한 위반 시</li>
            <li>영구 이용 제한: 지속적·고의적 위반 또는 법령 위반 시</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text)] mb-3">제6조 (문의)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            운영정책에 관한 문의사항은 아래 이메일로 연락해 주시기 바랍니다.<br />
            이메일: whatisf1@gmail.com
          </p>
        </section>

      </div>
    </main>
  )
}
