"use client";

import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Payment({
  searchParams,
}: Readonly<{
  searchParams: {
    service: "basic" | "pro";
  };
}>) {
  const [isPaid, setIsPaid] = useState(false);
  useEffect(() => {
    const interval = setInterval(checkPaymentStatus, 1000);
    return () => clearInterval(interval);
  }, []);
  let planInfo;
  switch (searchParams.service) {
    case "basic":
      planInfo = {
        name: "Plus",
        price: 5,
        feature: "Up to 5 credits/day",
      };
      break;
    case "pro":
      planInfo = {
        name: "Premium",
        price: 10,
        feature: "Up to 20 credits/day",
      };
      break;
  }
  const checkPaymentStatus = async () => {
    if (!isPaid) {
      // const response = await fetch("/api/checkPaymentStatus", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   // body: JSON.stringify({ orderId }),
      // });
      // const data = await response.json();
      // if (data.paymentStatus === "Paid") {
      //   setIsPaid(true);
      // }
    }
  };

  return (
    <div className="flex justify-center py-24">
      <Card className="max-w-4xl mx-auto px-8 pt-6 pb-8 mb-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Image
              src="https://qr.sepay.vn/img?bank=MBBank&acc=00016051993&template=compact&amount=100000"
              alt="QR code for payment"
              width={500}
              height={500}
            />
            {isPaid ? (
              <span className="flex gap-3">
                Trạng thái: Chờ thanh toán...
                <LoaderCircle className="animate-spin" />
              </span>
            ) : (
              <span>Trạng thái: Đã thanh toán</span>
            )}
          </div>
          <div>
            <div className="flex flex-col justify-center space-y-4 rounded-lg bg-background p-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{planInfo.name} Plan</h3>
                <p className="text-4xl font-bold">${planInfo.price}/mo</p>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>AI-generated slides</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>AI-generated quizzes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>{planInfo.feature}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Button variant="destructive">
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
