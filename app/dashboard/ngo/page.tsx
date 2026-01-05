import { getAvailableDonations } from '@/actions/fetch-donations'
import { DonationFeed } from '@/components/dashboard/donation-feed'

export default async function NgoDashboardPage() {
    const donations = await getAvailableDonations()

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Available Donations</h1>
            <DonationFeed initialDonations={donations} />
        </div>
    )
}
