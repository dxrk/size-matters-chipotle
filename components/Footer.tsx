import { CardFooter } from "@/components/ui/card";

export const Footer = () => (
  <CardFooter className="flex flex-col items-center justify-center text-gray-400 text-xs text-center">
    <div>
      In the wise words of your CEO, <q>all you got to do is, kinda, like...</q>{" "}
      <i>We all know that is not going to work.</i> <strong>Checkmate.</strong>
      <div>
        <a href="/disclosure" className="text-blue-500 underline mr-2">
          Disclosure
        </a>
        <span>|</span>
        <a href="/privacy" className="text-blue-500 underline ml-2">
          Privacy
        </a>
      </div>
    </div>
  </CardFooter>
);
