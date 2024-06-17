"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const Page: React.FC = () => {
  return (
    <div className="md:container select-none font-mono flex items-center justify-center min-h-screen pt-16 pb-16">
      <Card className="w-11/12 md:w-10/12 mx-auto flex flex-col items-center justify-center h-fit">
        <Header />
        <CardContent className="w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-xl font-semibold mb-3">
            <u>Disclosure</u>
          </h1>
          <h2 className="text-xl font-semibold mb-3">
            Not Affiliated with Chipotle
          </h2>
          <p className="mb-4">
            This site is an independent platform and is not affiliated,
            associated, authorized, endorsed by, or in any way officially
            connected with Chipotle Mexican Grill, Inc., or any of its
            subsidiaries or affiliates. The official Chipotle website can be
            found at{" "}
            <a
              href="https://www.chipotle.com"
              className="text-blue-500 underline"
            >
              chipotle.com
            </a>
            .
          </p>
          <h2 className="text-xl font-semibold mb-3">User-Generated Reviews</h2>
          <p className="mb-4">
            The reviews and ratings displayed on this site are user-generated
            content and reflect the opinions of individual users. These reviews
            are not influenced by Chipotle Mexican Grill, Inc., and should not
            be interpreted as statements or endorsements by Chipotle.
          </p>
          <h2 className="text-xl font-semibold mb-3">No Impact on Business</h2>
          <p className="mb-4">
            The reviews and ratings on this platform are for informational
            purposes only and are intended to provide feedback from customers
            about their experiences at various Chipotle locations. They are not
            intended to harm or negatively affect the business operations of any
            Chipotle restaurant.
          </p>
          <h2 className="text-xl font-semibold mb-3">
            Accuracy of Information
          </h2>
          <p className="mb-4">
            While we strive to maintain accurate and up-to-date information, we
            make no warranties or representations regarding the completeness,
            accuracy, reliability, or suitability of the information contained
            on this site. Users are encouraged to verify any information found
            here with official sources.
          </p>
          <h2 className="text-xl font-semibold mb-3">Use at Your Own Risk</h2>
          <p className="mb-4">
            Your use of the information provided on this site is at your own
            risk. We disclaim all liability for any loss or damage arising from
            reliance on the information contained on this site.
            <br />
            <br />
            By using this site, you acknowledge and agree to these terms.
          </p>
        </CardContent>
        <Footer />
      </Card>
    </div>
  );
};

export default Page;
