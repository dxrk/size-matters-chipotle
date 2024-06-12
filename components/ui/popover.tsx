import React, { ReactNode } from 'react';
import { Popover as HeadlessPopover } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  [key: string]: any;
}

const Popover: React.FC<PopoverProps> = ({ children, content, className = '', ...props }) => {
  return (
    <HeadlessPopover className={`relative ${className}`} {...props}>
      {({ open }) => (
        <>
          <HeadlessPopover.Button>{children}</HeadlessPopover.Button>
          <AnimatePresence>
            {open && (
              <HeadlessPopover.Panel
                static
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute z-10 mt-2 transform w-full max-w-sm sm:max-w-md p-4 bg-white shadow-lg rounded-lg"
              >
                {content}
              </HeadlessPopover.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </HeadlessPopover>
  );
};

export default Popover;