# Espouse PWA Icon Management Makefile
# Provides convenient commands for icon generation and testing

.PHONY: help icons test clean optimize install-deps

# Default target
help:
	@echo "Espouse PWA Icon Management"
	@echo ""
	@echo "Available commands:"
	@echo "  icons          Generate all PWA icons"
	@echo "  test           Test generated icons"
	@echo "  clean          Remove generated icons"
	@echo "  optimize       Optimize PNG files"
	@echo "  install-deps   Install dependencies"
	@echo "  help           Show this help message"
	@echo ""
	@echo "Generation methods:"
	@echo "  make icons     Auto-detect best method"
	@echo "  make icons-js  Use Node.js generator"
	@echo "  make icons-sh  Use shell generator"

# Auto-detect and generate icons
icons:
	@if command -v node >/dev/null 2>&1 && [ -f package.json ]; then \
		echo "🚀 Using Node.js generator..."; \
		$(MAKE) icons-js; \
	elif [ -f generate-icons.sh ]; then \
		echo "🚀 Using shell generator..."; \
		$(MAKE) icons-sh; \
	else \
		echo "❌ No generator found. Please install dependencies."; \
		exit 1; \
	fi

# Generate icons using Node.js
icons-js:
	@if ! command -v node >/dev/null 2>&1; then \
		echo "❌ Node.js not found. Please install Node.js."; \
		exit 1; \
	fi
	@if [ ! -d node_modules ]; then \
		echo "📦 Installing dependencies..."; \
		npm install; \
	fi
	@echo "🎨 Generating icons with Node.js..."
	@node generate-icons.js

# Generate icons using shell script
icons-sh:
	@if [ ! -x generate-icons.sh ]; then \
		echo "🔧 Making script executable..."; \
		chmod +x generate-icons.sh; \
	fi
	@echo "🎨 Generating icons with shell script..."
	@./generate-icons.sh

# Test generated icons
test:
	@if command -v node >/dev/null 2>&1 && [ -f test-icons.js ]; then \
		echo "🧪 Running Node.js tests..."; \
		node test-icons.js; \
	else \
		echo "❌ Test script not found or Node.js unavailable"; \
		exit 1; \
	fi

# Clean generated icons
clean:
	@echo "🧹 Cleaning generated icons..."
	@rm -f *.png *.ico *.md
	@echo "✅ Cleaned generated files"

# Optimize PNG files
optimize:
	@if command -v optipng >/dev/null 2>&1; then \
		echo "⚡ Optimizing PNG files..."; \
		optipng -o7 -silent *.png; \
		echo "✅ PNG files optimized"; \
	else \
		echo "⚠️  optipng not found. Install with: apt-get install optipng"; \
	fi

# Install dependencies
install-deps:
	@echo "📦 Installing dependencies..."
	@if command -v npm >/dev/null 2>&1; then \
		npm install; \
		echo "✅ Node.js dependencies installed"; \
	else \
		echo "❌ npm not found. Please install Node.js."; \
		exit 1; \
	fi

# Full workflow: clean -> generate -> test -> optimize
full: clean icons test optimize
	@echo "🎉 Full icon workflow completed!"

# Quick workflow for development (no optimization)
dev: clean icons test
	@echo "⚡ Development workflow completed!"

# Check if all required tools are available
check-tools:
	@echo "🔍 Checking for required tools..."
	@if command -v node >/dev/null 2>&1; then \
		echo "✅ Node.js: $(node --version)"; \
	else \
		echo "❌ Node.js: not found"; \
	fi
	@if command -v npm >/dev/null 2>&1; then \
		echo "✅ npm: $(npm --version)"; \
	else \
		echo "❌ npm: not found"; \
	fi
	@if command -v rsvg-convert >/dev/null 2>&1; then \
		echo "✅ rsvg-convert: available"; \
	else \
		echo "⚠️  rsvg-convert: not found (optional)"; \
	fi
	@if command -v inkscape >/dev/null 2>&1; then \
		echo "✅ Inkscape: available"; \
	else \
		echo "⚠️  Inkscape: not found (optional)"; \
	fi
	@if command -v optipng >/dev/null 2>&1; then \
		echo "✅ optipng: available"; \
	else \
		echo "⚠️  optipng: not found (optional)"; \
	fi

# Show file sizes
sizes:
	@echo "📊 Icon file sizes:"
	@ls -lh *.png *.ico *.svg 2>/dev/null || echo "No icon files found"

# Validate manifest.json
validate-manifest:
	@echo "📋 Validating manifest.json..."
	@if [ -f ../manifest.json ]; then \
		node -e "try { JSON.parse(require('fs').readFileSync('../manifest.json', 'utf8')); console.log('✅ Valid JSON'); } catch(e) { console.log('❌ Invalid JSON:', e.message); process.exit(1); }"; \
	else \
		echo "❌ manifest.json not found"; \
		exit 1; \
	fi