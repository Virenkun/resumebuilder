import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
  once?: boolean;
};

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  once = true,
  ...rest
}: FadeInProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children as React.ReactNode}</div>;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.2, 0.8, 0.2, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
