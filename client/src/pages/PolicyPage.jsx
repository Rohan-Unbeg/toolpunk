// pages/PolicyPage.jsx
import React from "react";
import { Card, CardContent } from "../components/Card";

const PolicyPage = ({ title, children }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <Card>
        <CardContent className="p-6 sm:p-8 md:p-10">
          <div className="space-y-6 text-gray-800">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 border-b pb-4">{title}</h1>
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
              {children}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

export const TermsAndConditions = () => (
  <PolicyPage title="Terms and Conditions">
    <p>Welcome to Toolpunk. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.</p>
    <ul>
      <li>All tools provided are for informational and project use only.</li>
      <li>You may not use Toolpunk for any unlawful or prohibited purpose.</li>
      <li>We reserve the right to update terms at any time.</li>
    </ul>
  </PolicyPage>
);

export const PrivacyPolicy = () => (
  <PolicyPage title="Privacy Policy">
    <p>We respect your privacy and are committed to protecting it. This policy outlines how we collect, use, and safeguard your data.</p>
    <ul>
      <li>We collect only necessary information such as your email and usage activity.</li>
      <li>Data is stored securely using Appwrite services.</li>
      <li>We never sell your data to third parties.</li>
    </ul>
  </PolicyPage>
);

export const RefundPolicy = () => (
  <PolicyPage title="Cancellations and Refunds">
    <p>Toolpunk offers digital services and tools. As such, purchases are non-refundable unless there was a technical issue or accidental duplicate charge.</p>
    <ul>
      <li>Refunds, if applicable, will be processed within 5-7 working days.</li>
      <li>To request a refund, please contact us at support@toolpunk.com.</li>
    </ul>
  </PolicyPage>
);

export const ShippingPolicy = () => (
  <PolicyPage title="Shipping Policy">
    <p>Toolpunk is a digital platform. No physical products are shipped. All services are delivered online instantly or via your account dashboard.</p>
  </PolicyPage>
);
