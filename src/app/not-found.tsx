export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-3 text-gray-600">
          The page you requested does not exist in this project.
        </p>
      </div>
    </main>
  );
}
