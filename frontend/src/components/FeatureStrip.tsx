import { Box } from "@mui/material";
import type { FeatureItem } from "../types";

interface FeatureStripProps {
  items: FeatureItem[];
  onFeatureClick?: (item: FeatureItem) => void;
}

export function FeatureStrip({ items, onFeatureClick }: FeatureStripProps) {
  return (
    <section className="feature-strip" aria-label="核心功能">
      {items.map((item) => (
        <Box
          component="article"
          className="feature-panel"
          key={item.title}
          onClick={() => onFeatureClick?.(item)}
          sx={{
            cursor: onFeatureClick ? "pointer" : "default",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": onFeatureClick
              ? {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 30px rgba(31, 24, 48, 0.15)",
                }
              : {},
          }}
        >
          <span className="pill">{item.metric}</span>
          <strong>{item.title}</strong>
          <p>{item.description}</p>
        </Box>
      ))}
    </section>
  );
}
