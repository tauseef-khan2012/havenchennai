
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingDown } from 'lucide-react';
import { PlatformComparison as PlatformComparisonType } from '@/services/platformRatesService';

interface PlatformComparisonProps {
  directPrice: number;
  platformComparisons: PlatformComparisonType[];
  currency: string;
  onPlatformSelect?: (platform: string, url?: string) => void;
}

const PlatformComparison: React.FC<PlatformComparisonProps> = ({
  directPrice,
  platformComparisons,
  currency = 'INR',
  onPlatformSelect
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const directBookingSavings = Math.min(...platformComparisons.map(p => p.totalPrice)) - directPrice;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Platform Comparison</CardTitle>
        <p className="text-sm text-gray-600">
          Compare prices across different booking platforms
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Direct Booking Option */}
          <div className="p-4 border-2 border-haven-teal rounded-lg bg-haven-teal/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-haven-teal">Book Direct (Recommended)</h3>
                <p className="text-sm text-gray-600">Best price guaranteed</p>
                {directBookingSavings > 0 && (
                  <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                    <TrendingDown className="h-4 w-4" />
                    Save {formatCurrency(directBookingSavings)}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-haven-teal">
                  {formatCurrency(directPrice)}
                </div>
                <Badge variant="secondary" className="bg-haven-teal text-white">
                  Best Deal
                </Badge>
              </div>
            </div>
          </div>

          {/* Platform Options */}
          {platformComparisons.map((platform) => (
            <div key={platform.platform} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{platform.displayName}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Base Rate: {formatCurrency(platform.fees.baseRate)}</div>
                    {platform.fees.platformFee > 0 && (
                      <div>Platform Fee: {formatCurrency(platform.fees.platformFee)}</div>
                    )}
                    {platform.fees.commission > 0 && (
                      <div>Service Fee: {formatCurrency(platform.fees.commission)}</div>
                    )}
                  </div>
                  {platform.savings > 0 && (
                    <div className="text-sm text-red-600 mt-1">
                      +{formatCurrency(platform.savings)} more than direct
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    {formatCurrency(platform.totalPrice)}
                  </div>
                  {platform.bookingUrl && platform.isAvailable && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => onPlatformSelect?.(platform.platform, platform.bookingUrl)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Book on {platform.displayName}
                    </Button>
                  )}
                  {!platform.isAvailable && (
                    <Badge variant="secondary" className="mt-2">
                      Not Available
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}

          {platformComparisons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Platform rates not available for these dates.</p>
              <p className="text-sm">Book direct for the best experience!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformComparison;
