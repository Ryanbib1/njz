import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "!./**/*.md",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Tailwind 默认类 → 项目字体变量映射
        // font-sans: 正文字体 (--font-body)
        // font-serif: 标题字体 (--font-header)
        // font-mono: 代码字体 (--font-mono)
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["var(--font-display)", "sans-serif"],
        // 语义化别名 (推荐使用)
        header: ["var(--font-header)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        DEFAULT: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      colors: {
        background: "var(--color-background, var(--background))",
        foreground: "var(--color-foreground, var(--foreground))",

        // Semantic Colors
        primary: {
          DEFAULT: "var(--color-primary, var(--primary))",
          foreground: "var(--color-primary-foreground, var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "var(--color-secondary, var(--secondary))",
          foreground: "var(--color-secondary-foreground, var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "var(--color-muted, var(--muted))",
          foreground: "var(--color-muted-foreground, var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "var(--color-accent, var(--accent))",
          foreground: "var(--color-accent-foreground, var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "var(--color-destructive, var(--destructive))",
          foreground: "var(--color-destructive-foreground, var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "var(--color-success, var(--success))",
          foreground: "var(--color-success-foreground, var(--success-foreground))",
        },
        warning: {
          DEFAULT: "var(--color-warning, var(--warning))",
          foreground: "var(--color-warning-foreground, var(--warning-foreground))",
        },
        info: {
          DEFAULT: "var(--color-info, var(--info))",
          foreground: "var(--color-info-foreground, var(--info-foreground))",
        },

        // UI Components
        card: {
          DEFAULT: "var(--color-card, var(--card))",
          foreground: "var(--color-card-foreground, var(--card-foreground))",
        },
        popover: {
          DEFAULT: "var(--color-popover, var(--popover))",
          foreground: "var(--color-popover-foreground, var(--popover-foreground))",
        },
        input: "var(--color-input, var(--input))",
        ring: "var(--color-ring, var(--ring))",
        border: "var(--color-border, var(--border))",
        chart: {
          1: "var(--color-chart-1, var(--chart-1))",
          2: "var(--color-chart-2, var(--chart-2))",
          3: "var(--color-chart-3, var(--chart-3))",
          4: "var(--color-chart-4, var(--chart-4))",
          5: "var(--color-chart-5, var(--chart-5))",
        },

        // Sidebar Specific
        sidebar: {
          DEFAULT: "var(--color-sidebar-background, var(--sidebar-background))",
          background: "var(--color-sidebar-background, var(--sidebar-background))",
          foreground: "var(--color-sidebar-foreground, var(--sidebar-foreground))",
          primary: "var(--color-sidebar-primary, var(--sidebar-primary))",
          "primary-foreground": "var(--color-sidebar-primary-foreground, var(--sidebar-primary-foreground))",
          accent: "var(--color-sidebar-accent, var(--sidebar-accent))",
          "accent-foreground": "var(--color-sidebar-accent-foreground, var(--sidebar-accent-foreground))",
          border: "var(--color-sidebar-border, var(--sidebar-border))",
          ring: "var(--color-sidebar-ring, var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float-subtle": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate3d(-8px, 0, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(8px, -12px, 0) rotate(1deg)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.04)" },
        },
        // ── 明显档动画原语（visible tier）：幅度/旋转/发光显著，用户要"动态/有创意/看得见的动画"时用 ──
        "float-bold": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(20px) rotate(-5deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px currentColor" },
          "50%": { boxShadow: "0 0 40px currentColor, 0 0 60px currentColor" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "bounce-bold": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glitch": {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(2px, -2px)" },
          "60%": { transform: "translate(-1px, -1px)" },
          "80%": { transform: "translate(1px, 1px)" },
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "rgb-shift": {
          "0%, 100%": { textShadow: "-2px 0 #ff00ff, 2px 0 #00d4ff" },
          "50%": { textShadow: "2px 0 #ff00ff, -2px 0 #00d4ff" },
        },
        "blink": {
          "50%": { opacity: "0" },
        },
        "clay-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(2deg)" },
        },
        "clay-float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-30px) rotate(5deg)" },
        },
        "clay-breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-subtle": "float-subtle 14s ease-in-out infinite",
        "drift-slow": "drift-slow 20s ease-in-out infinite",
        "fade-in": "fade-in 420ms ease-out both",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
        // ── 明显档（visible tier）注册：时长更短、动作更大，肉眼可见 ──
        "float-bold": "float-bold 6s ease-in-out infinite",
        "float-reverse": "float-reverse 5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "bounce-bold": "bounce-bold 2s ease-in-out infinite",
        "glitch": "glitch 0.4s steps(2) infinite",
        "scanline": "scanline 6s linear infinite",
        "rgb-shift": "rgb-shift 1.5s ease-in-out infinite",
        "blink": "blink 1s step-end infinite",
        "clay-float": "clay-float 8s ease-in-out infinite",
        "clay-float-slow": "clay-float-slow 12s ease-in-out infinite",
        "clay-breathe": "clay-breathe 4s ease-in-out infinite",
      },
      text: {
        // Typography System
        display: ["var(--font-size-display)", {
          lineHeight: "var(--line-height-tight)",
          letterSpacing: "var(--letter-spacing-tight)",
          fontWeight: "var(--font-weight-bold)",
          fontFamily: "var(--font-display)", // Auto-bind font family
        }],
        h1: ["var(--font-size-h1)", {
          lineHeight: "var(--line-height-tight)",
          letterSpacing: "var(--letter-spacing-tight)",
          fontWeight: "var(--font-weight-bold)",
          fontFamily: "var(--font-header)",
        }],
        h2: ["var(--font-size-h2)", {
          lineHeight: "var(--line-height-normal)",
          letterSpacing: "var(--letter-spacing-normal)",
          fontWeight: "var(--font-weight-semibold)",
          fontFamily: "var(--font-header)",
        }],
        h3: ["var(--font-size-h3)", {
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-semibold)",
          fontFamily: "var(--font-header)",
        }],
        h4: ["var(--font-size-h4)", {
          lineHeight: "var(--line-height-relaxed)",
          fontWeight: "var(--font-weight-medium)",
          fontFamily: "var(--font-header)",
        }],
        base: ["var(--font-size-base)", {
          lineHeight: "var(--line-height-loose)",
          letterSpacing: "var(--letter-spacing-base)",
          fontWeight: "var(--font-weight-normal)",
          fontFamily: "var(--font-body)",
        }],
        "sm-body": ["var(--font-size-sm-body)", {
          lineHeight: "var(--line-height-loose)",
          fontWeight: "var(--font-weight-normal)",
          fontFamily: "var(--font-body)",
        }],
        caption: ["var(--font-size-caption)", {
          lineHeight: "var(--line-height-relaxed)",
          letterSpacing: "var(--letter-spacing-wide)",
          fontWeight: "var(--font-weight-semibold)",
          fontFamily: "var(--font-body)",
        }],
      },
      
    },
    screens: {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
    },
  },
  plugins: [],
};

export default config;
