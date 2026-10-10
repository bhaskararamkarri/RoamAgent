/// <reference types="react" />
/// <reference types="react-dom" />

import { HTMLMotionComponents, SVGMotionComponents } from "framer-motion";

declare global {
  namespace JSX {
    interface IntrinsicElements extends HTMLMotionComponents, SVGMotionComponents {}
  }
}

declare module "framer-motion" {
  export const motion: {
    [K in keyof HTMLMotionComponents]: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<HTMLMotionComponents[K]> & React.RefAttributes<HTMLMotionComponents[K]>
    >;
  } & {
    [K in keyof SVGMotionComponents]: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<SVGMotionComponents[K]> & React.RefAttributes<SVGMotionComponents[K]>
    >;
  };
}

declare module "motion/react" {
  export const motion: {
    [K in keyof HTMLMotionComponents]: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<HTMLMotionComponents[K]> & React.RefAttributes<HTMLMotionComponents[K]>
    >;
  } & {
    [K in keyof SVGMotionComponents]: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<SVGMotionComponents[K]> & React.RefAttributes<SVGMotionComponents[K]>
    >;
  };
}