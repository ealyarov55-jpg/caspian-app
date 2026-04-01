// analytics.js
export function calculateDashboardStats(inventory) {
    let totalVolumeNet = 0;
    let totalSavings = 0;

    inventory.forEach(item => {
        const net = parseFloat(item.netCost || 0);
        const rack = parseFloat(item.rackRate || 0);

        // Общий объем инвестиций/затрат (Net)
        totalVolumeNet += net;

        // Высчитываем сэкономленную комиссию (Savings)
        if (rack > 0 && net > 0 && rack >= net) {
            const standardOTACommission = rack * 0.30;
            const discountGivenToUs = rack - net;
            const savingsOnThisItem = standardOTACommission - discountGivenToUs;
            
            if (savingsOnThisItem > 0) {
                totalSavings += savingsOnThisItem;
            }
        }
    });

    return {
        volume: totalVolumeNet.toFixed(2),
        savings: totalSavings.toFixed(2)
    };
}