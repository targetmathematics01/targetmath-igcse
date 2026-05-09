export default function PendingPaymentPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6">
      <div className="card text-center">
        <h1 className="text-3xl font-black">Payment Pending</h1>
        <p className="mt-3 text-slate-600">Your screenshot has been submitted. Please wait for admin approval.</p>
        <a href="/videos" className="btn mt-6 inline-block">Back to Lessons</a>
      </div>
    </main>
  );
}
