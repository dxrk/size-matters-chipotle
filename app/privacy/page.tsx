"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="md:container select-none font-mono flex items-center justify-center min-h-screen pt-16 pb-16">
      <Card className="w-11/12 md:w-10/12 mx-auto flex flex-col items-center justify-center h-fit">
        <Header />
        <CardContent className="w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-xl font-semibold mb-3">
            <u>Privacy Policy</u>
          </h1>
          <p className="mb-4">
            We value your privacy and are committed to protecting your personal
            information. This Privacy Policy outlines how we handle your data.
          </p>
          <h2 className="text-xl font-semibold mb-3">
            No Personal Information Stored
          </h2>
          <p className="mb-4">
            Our site does not collect, store, or process any personal
            information from our users. We do not require you to create an
            account or provide any personal details to access our services.
          </p>
          <h2 className="text-xl font-semibold mb-3">Anonymous Usage</h2>
          <p className="mb-4">
            You can use our site anonymously. We do not track or record any
            identifiable information about your visit. Our site is designed to
            be a resource for user-generated reviews without compromising your
            privacy.
          </p>
          <h2 className="text-xl font-semibold mb-3">Cookies</h2>
          <p className="mb-4">
            Our site does not use cookies or any other tracking technologies to
            monitor your activity. We respect your privacy and ensure that your
            browsing experience remains anonymous.
          </p>
          <h2 className="text-xl font-semibold mb-3">Third-Party Links</h2>
          <p className="mb-4">
            Our site may contain links to third-party websites. We are not
            responsible for the privacy practices or content of these external
            sites. We encourage you to review the privacy policies of any
            third-party sites you visit.
          </p>
          <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page, and we encourage you to review this
            policy periodically. Your continued use of the site constitutes your
            acceptance of any changes to this policy.
          </p>
        </CardContent>
        <Footer />
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
