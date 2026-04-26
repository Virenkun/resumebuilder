import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
};

export function Stagger({
  children,
  stagger = 0.08,
  delayChildren = 0,
  once = true,
  ...rest
}: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children as React.ReactNode}</div>;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = HTMLMotionProps<"div"> & {
  y?: number;
  duration?: number;
};

export function StaggerItem({
  children,
  y = 16,
  duration = 0.5,
  ...rest
}: StaggerItemProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children as React.ReactNode}</div>;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: [0.2, 0.8, 0.2, 1] },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
