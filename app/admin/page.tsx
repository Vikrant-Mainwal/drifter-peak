"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductService } from "@/services/product.service";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    ProductService.getAll().then(p => setProductCount(p.length));
  }, []);

  const stats = [
    { label: "TOTAL PRODUCTS", value: productCount },
    { label: "ORDERS TODAY",   value: 12 },
    { label: "REVENUE (MTD)",  value: "₹1,24,000" },
    { label: "ACTIVE USERS",   value: 84 },
  ];

  return (
    <div className="space-y-6 anim-fade-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} padding="md">
            {s.value === null
              ? <Skeleton className="h-8 w-24 mb-2" />
              : <p className="font-display text-4xl mb-1" style={{ color: "var(--fg)" }}>{s.value}</p>
            }
            <p className="font-mono text-[10px] tracking-[0.25em]" style={{ color: "var(--muted)" }}>{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}