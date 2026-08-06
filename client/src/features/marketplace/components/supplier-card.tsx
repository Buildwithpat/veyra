import { BadgeCheck, Clock, MapPin, Star } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Supplier } from "@/features/marketplace/types"
import { getInitials } from "@/lib/initials"

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6">
        <div className="flex items-start gap-3">
          <Avatar className="size-11">
            <AvatarFallback>{getInitials(supplier.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-foreground truncate font-medium">{supplier.name}</h3>
              {supplier.verified && (
                <BadgeCheck className="text-primary size-4 shrink-0" />
              )}
            </div>
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <MapPin className="size-3" />
              {supplier.city}, {supplier.country}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Star className="fill-warning text-warning size-3.5" />
            {supplier.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            {supplier.yearsInBusiness} yrs in business
          </span>
        </div>

        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Clock className="size-3.5" />
          {supplier.responseTime}
        </p>

        {supplier.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {supplier.certifications.map((cert) => (
              <Badge key={cert} variant="outline">
                {cert}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
