
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			spacing: { 
				sm: '20px', 
				md: '40px', 
				lg: '80px' 
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Enhanced Haven brand colors with nature-inspired variations
				haven: {
					'green': '#3b5249',
					'green-light': '#4a6358',
					'green-dark': '#2d3f37',
					'beige': '#F5F2EE',
					'beige-warm': '#F7F4F0',
					'beige-cool': '#F3F0EC',
					'dark': '#2C2F33',
					'teal': '#007F7F',
					'teal-light': '#1a9999',
					'teal-dark': '#006666',
					'brown': '#65524d',
					'brown-light': '#7a6560',
					'brown-dark': '#50413d',
					'blue': '#75869b',
					'blue-light': '#8a9bb2',
					'blue-dark': '#607184',
					'light-blue': '#bfd7ea',
					'light-blue-soft': '#d4e4f1',
					'light-blue-pale': '#e8f2f8',
					// Nature-inspired accent colors
					'sunset': '#FF6B6B',
					'sunset-orange': '#FFA500',
					'sunset-gold': '#FFD700',
					'forest': '#228B22',
					'forest-deep': '#006400',
					'lake': '#4682B4',
					'lake-deep': '#1e3a5f',
					'earth': '#8B5A2B',
					'stone': '#A9A9A9',
					'moss': '#7CB342',
					'sage': '#9CAF88',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// Organic border radius options
				'organic': '60% 40% 30% 70% / 60% 30% 70% 40%',
				'organic-2': '30% 70% 70% 30% / 30% 30% 70% 70%',
				'organic-3': '40% 60% 60% 40% / 60% 30% 70% 40%',
			},
			fontFamily: {
				'handwritten': ['Caveat', 'cursive'],
				'serif': ['Playfair Display', 'serif'],
				'sans': ['Inter', 'sans-serif'],
			},
			fontSize: {
				'hero': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'hero-mobile': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
			},
			backgroundImage: {
				'nature-gradient': 'var(--nature-gradient-primary)',
				'sunset-gradient': 'var(--nature-gradient-sunset)',
				'lake-gradient': 'var(--nature-gradient-lake)',
				'earth-gradient': 'var(--nature-gradient-earth)',
			},
			boxShadow: {
				'organic': 'var(--organic-shadow)',
				'organic-hover': 'var(--organic-shadow-hover)',
				'soft': '0 4px 20px rgba(59, 82, 73, 0.1)',
				'medium': '0 8px 30px rgba(59, 82, 73, 0.15)',
				'large': '0 15px 50px rgba(59, 82, 73, 0.2)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'ken-burns': {
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1.05)' }
				},
				'scale-up': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'float-gentle': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'breathe': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'water-ripple': {
					'0%': { backgroundPosition: '0% 0%, 0% 0%' },
					'100%': { backgroundPosition: '100% 100%, -100% -100%' }
				},
				'organic-pulse': {
					'0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.1)' }
				},
				'nature-sway': {
					'0%, 100%': { transform: 'rotate(-1deg)' },
					'50%': { transform: 'rotate(1deg)' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'fade-up': 'fade-up 0.8s ease-out',
				'ken-burns': 'ken-burns 15s ease-out alternate infinite',
				'scale-up': 'scale-up 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'float-gentle': 'float-gentle 4s ease-in-out infinite',
				'breathe': 'breathe 3s ease-in-out infinite',
				'water-ripple': 'water-ripple 8s ease-in-out infinite alternate',
				'organic-pulse': 'organic-pulse 2s ease-in-out infinite',
				'nature-sway': 'nature-sway 4s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite'
			},
			blur: {
				'xs': '2px',
			},
			backdropBlur: {
				'xs': '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
