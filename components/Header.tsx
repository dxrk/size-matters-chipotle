import { CardHeader, CardTitle } from "@/components/ui/card";

export const Header = () => (
  <CardHeader className="flex items-center justify-center">
    <a href="/">
      <CardTitle className="text-center">
        <i>Size Matters,</i>
        <br /> Chipotle.
      </CardTitle>
    </a>
    <h2 className="text-gray-500 text-center">
      Bowls that deliver: Find and rate Chipotle locations with the best
      portions!
    </h2>
  </CardHeader>
);
