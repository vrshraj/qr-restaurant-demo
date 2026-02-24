import { MenuClient } from '@/components/MenuClient'

interface MenuPageProps {
    searchParams: Promise<{ table?: string }>
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
    const params = await searchParams
    const tableNumber = params.table ?? '1'

    return <MenuClient tableNumber={tableNumber} />
}
