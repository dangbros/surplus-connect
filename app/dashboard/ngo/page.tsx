import { getAvailableDonations } from '@/actions/fetch-donations'
import { DonationFeed } from '@/components/dashboard/donation-feed'

export default async function NgoDashboardPage() {
  const donations = await getAvailableDonations()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
          Available Donations
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Browse and claim surplus food donations in your area. AI-powered verification ensures safety and quality.
        </p>
      </header>

      {/* Donations Feed */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DonationFeed initialDonations={donations} />
      </main>

      {/* Footer / Info */}
      <footer className="max-w-5xl mx-auto mt-12 text-center text-gray-500 text-sm">
        💡 Tip: Click a donation to see details and claim for pickup. Every donation saved makes an impact!
      </footer>
    </div>
  )
}
