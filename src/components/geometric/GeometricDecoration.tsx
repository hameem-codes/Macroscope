interface GeometricDecorationProps {
  variant: "circle" | "triangle" | "dots" | "diamond" | "lines";
  color?: string;
  size?: number;
  className?: string;
}

export default function GeometricDecoration({
  variant,
  color = "#8B5CF6",
  size = 60,
  className = "",
}: GeometricDecorationProps) {
  switch (variant) {
    case "circle":
      return (
        <div
          className={`rounded-full opacity-15 ${className}`}
          style={{ width: size, height: size, backgroundColor: color }}
          aria-hidden="true"
        />
      );
    case "triangle":
      return (
        <div
          className={`opacity-15 ${className}`}
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
          }}
          aria-hidden="true"
        />
      );
    case "dots":
      return (
        <div
          className={`opacity-10 ${className}`}
          style={{
            width: size,
            height: size,
            backgroundImage: `radial-gradient(circle, ${color} 1.5px, transparent 1.5px)`,
            backgroundSize: "12px 12px",
          }}
          aria-hidden="true"
        />
      );
    case "diamond":
      return (
        <div
          className={`rotate-45 opacity-15 ${className}`}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
          aria-hidden="true"
        />
      );
    case "lines":
      return (
        <div
          className={`opacity-10 ${className}`}
          style={{
            width: size,
            height: size,
            backgroundImage: `repeating-linear-gradient(45deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 8px)`,
          }}
          aria-hidden="true"
        />
      );
    default:
      return null;
  }
}
