export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-red-500">
          Formula 1 Data Platform
        </p>

        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
          F1 웹사이트 프로젝트 시작
        </h1>

        <p className="max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
          드라이버, 팀, 레이스 일정, 결과, 시즌 데이터를 한 곳에서 확인할 수 있는
          Formula 1 프론트엔드 서비스를 구축합니다.
        </p>
      </section>
    </main>
  );
}